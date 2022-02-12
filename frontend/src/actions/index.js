import { SERVER } from "../config/global";

export const getJobs = (
    filterString,
    page,
    pageSize,
    sortField,
    sortOrder
) => {
    return {
        type: "GET_JOBS",
        payload: async () => {
            const response = await fetch(
                `${SERVER}/jobs?${filterString}&sortField=${
                  sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
                  pageSize || ""
                }`
              );
            const data = await response.json();
            return data;

        },
    };
};

export const addJob = (
    job,
    filterString,
    page,
    pageSize,
    sortField,
    sortOrder 
)=>{
    return {
        type: "ADD_JOB",
        payload: async () => {
            let response = await fetch(`${SERVER}/jobs`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(job),
            });
            response = await fetch(
              `${SERVER}/jobs?${filterString}&sortField=${
                sortField || ""
              }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
                pageSize || ""
              }`
            );
            const data = await response.json();
            return data;
        },

    };
};


export const saveJob = (
    id,
    job,
    filterString,
    page,
    pageSize,
    sortField, 
    sortOrder
) =>{
    return {
        type: "SAVE_JOB",
        payload: async () => {
          let response = await fetch(`${SERVER}/jobs/${id}`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(job),
          });
          response = await fetch(
            `${SERVER}/jobs?${filterString}&sortField=${
              sortField || ""
            }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
              pageSize || ""
            }`
          );
          const data = await response.json();
          return data;
        },
      };

};

export const deleteJob = (
    id,
    filterString,
    page,
    pageSize,
    sortField,
    sortOrder
) => {
    return {
        type: "DELETE_JOB",
        payload: async () => {
          let response = await fetch(`${SERVER}/jobs/${id}`, {
            method: "delete",
          });
          response = await fetch(
            `${SERVER}/jobs?${filterString}&sortField=${
              sortField || ""
            }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
              pageSize || ""
            }`
          );
          const data = await response.json();
          return data;
        },
      };
};



