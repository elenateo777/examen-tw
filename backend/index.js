'use strict';
const express = require('express');
const cors = require("cors");
const app = express();
const port=7777;
const sequelize = require('./sequelize');
const bodyParser = require("body-parser");

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

app.use(cors());

const JobPosting = require("./models/jobPosting");
const Candidate = require("./models/candidate");

JobPosting.hasMany(Candidate);
Candidate.belongsTo(JobPosting);


app.use(express.json());

app.listen(port, () => {
    console.log("The server is running on http://localhost:" + port);
  });

  app.use((err, req, res, next) => {
    console.error("[ERROR]:" + err);
    res.stats(500).json({message: "500 Server Error"});
});

app.get("/create", async (req, res, next) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).json({ message: "Baza de date a fost realizata cu succes."});
    } catch (err) {
      next(err);
    }
});


app.get("/jobs", async (request, response, next)=>{
    try{
        const Op = require("sequelize").Op;
        const query = {};
        let pageSize = 2;

        const allowedFilters = ["id", "descriere"];
        const filterKeys = Object.keys(request.query).filter(
            (e) => allowedFilters.indexOf(e) !== -1
        );

        if (filterKeys.length > 0) {
            query.where = {};

            for (const key of filterKeys) {
                if (isNaN(request.query[key]) == true) {
                    query.where[key] = { [Op.like]: `%${request.query[key]}%` };
                }
                else {
                    query.where[key] = {
                        [Op.eq]: parseFloat(request.query[key]),
                    };
                }
            }
        }

        if (request.query.pageSize) {
            pageSize = parseInt(request.query.pageSize);
        }

        if (request.query.sortField) {
            const sortField = request.query.sortField;
            const sortOrder = request.query.sortOrder ? request.query.sortOrder : 'ASC';
            query.order = [[sortField, sortOrder]];
        }

        if (!isNaN(parseInt(request.query.page))) {
            query.limit = pageSize;
            query.offset = pageSize * parseInt(request.query.page);
        }

        const data = await JobPosting.findAll(query);
        const count = await JobPosting.count();
        response.status(200).json({ data, count });
    } catch (err) {
        next(err)
    }
});

app.get("/jobs/:jobId", async(req, res, next)=>{
    try{
        const job = await JobPosting.findByPk(req.params.jobId);
        if(job) {
            res.status(200).json(job);
        } else {
            res.status(404).json({message:"Job not found!"});
        }
    } catch(err){
        next(err);
    }
});

// POST Job
app.post("/jobs", async(req, res, next)=> {
    try{
        const job = await JobPosting.create(req.body);
        res.status(200).json({message: "Job adaugat!"});
    } catch (err){
        next(err);
    }
})

//PUT Job
app.put("/jobs/:jobId", async (req, res, next) =>{
    try{
        if(req.body.descriere < 3) {
            res.status(400).json({message: "Invalid job"});
        }
        else{
            const job = await JobPosting.findByPk(req.params.jobId)
            if(job) {
                Object.assign(job, req.body);
                await job.save();
                res.status(201).json({message: "Job posting updated!"});
            } else {
                res.status(404).json({message: "Job posting not found!"});
            }

        }
    } catch (err){
        next(err);
    }
});

//DELETE Job
app.delete("/jobs/:jobId", async (req, res, next) => {
    try {
      const job = await JobPosting.findByPk(req.params.jobId);
      if (job) {
        await job.destroy();
        res.status(200).json({
          message: `Job-ul cu id-ul ${req.params.jobId} a fost sters!`,
        });
      } else {
        res.status(404).json({
          error: `Job-ul cu id-ul ${req.params.jobId} nu a fost gasit!`,
        });
      }
    } catch (err) {
      next(err);
    }
});

 //GET Candidate
 app.get("/jobs/:jobId/candidates", async (req, res, next)=>{
    try{
        const job = await JobPosting.findByPk(req.params.jobId, {
            include: [Candidate],
        });
        if(job) {
            res.status(200).json(job.candidates);

        } else {
            res.status(404).json({message: "Job not found!"});
        }

    } catch(err){
        next(err);
    }

});

//POST Candidate
app.post("/jobs/:jobId/candidates", async (req, res, next)=>{
    try{
        const job = await JobPosting.findByPk(req.params.jobId);
        if(job){
            const candidate = new Candidate(req.body);
            candidate.jobId = job.id;
            await candidate.save();
            res.status(201).json({message: "Candidate created!"});

        } else {
            res.status(404).json({message: "Job not found!"});
        }
    } catch (err){
        next(err);
    }
});

// PUT Candidate
app.put("/jobs/:jobId/candidates/:candidateId", async (req, res, next)=>{
    try{
        const job = await JobPosting.findByPk(req.params.jobId)
        if(job){
            const candidates = await job.getCandidates({ id: req.params.candidateId})
            const candidate = candidates.shift()
            if(candidate) {
                Object.assign(candidate, req.body);
                await candidate.save()
                res.status(202).json({message: 'Candidate updated!'})

            } else {
                res.status(404).json({message: 'Candidate not found!'})
            }
        }  else {
            res.status(404).json({message: 'Job not found!'})
        }
    } catch (err) {
            next(err);
    }
});

//DELETE Candidate
app.delete("/jobs/:jobId/candidates/:candidateId", async (req, res, next)=>{
    try{
        const job = await JobPosting.findByPk(req.params.jobId)
        if(job){
            const candidates = await job.getCandidates({ id: req.params.candidateId})
            const candidate = candidates.shift()
            if(candidate) {
               await candidate.destroy();
                res.status(202).json({message: 'Candidate deleted!'})

            } else {
                res.status(404).json({message: 'Candidate not found!'})
            }
        }  else {
            res.status(404).json({message: 'Job not found!'})
        }
    } catch (err) {
            next(err);
    }
});

//EXPORT 
app.get('/export', async(req, res, next)=>{
    try{
        const result=[];
        for(let j of await JobPosting.findAll()){
            const job = {
                descriere: j.descriere,
                deadline: j.deadline,
                candidates: [],
            };
            for(let c of await j.getCandidates()){
                job.candidates.push({
                    id: c.id,
                    nume: c.nume,
                    cv: c.cv,
                    email: c.email,
                });
            }
            result.push(job);
        }
        if(result.length >0) {
            res.json(result);
        } else {
            res.sendStatus(204);
        } 
    } catch(err){
        next(err);
    }
});


//IMPORT
app.post("/import", async(req, res, next)=>{
    try{
        const registry={};
        for(let j of req.body){
            const job = await JobPosting.create(j);
            for(let c of j.candidates) {
                const candidate = await Candidate.create(c);
                registry[c.id] = candidate;
                job.addCandidate(candidate);
            }
            await job.save();
        }
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
});