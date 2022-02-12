const INITIAL_STATE ={
    jobList: [],
    count: 0,
    error: null,
    fetching: false,
    fetched: false
    
}

export default function reducer (state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'GET_JOBS_PENDING':
        case 'ADD_JOBS_PENDING':
        case 'SAVE_JOBS_PENDING':
        case 'DELETE_JOBS_PENDING':
            return {...state, error: null, fetching:true, fetched:false}
        case 'GET_JOBS_FULFILLED':
        case 'ADD_JOBS_FULFILLED':
        case 'SAVE_JOBS_FULFILLED':
        case 'DELETE_JOBS_FULFILLED':
            return{...state, jobList: action.payload.data, count: action.payload.count, error: null, fetching: false, fetched:true}
        
        case 'GET_JOBS_REJECTED':
        case 'ADD_JOBS_REJECTED':
        case 'SAVE_JOBS_REJECTED':
        case 'DELETE_JOBS_REJECTED':
            return {...state, jobList:[], error:action.payload, fetching:false, fetched:false }
        default:
            return state
    }

}