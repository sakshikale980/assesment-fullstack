export const BEEAH_API = {

    //User API
    GET_USER: 'users/get?pageSize=',
    ADD_USER: 'users/add',
    GET_ROLE: 'master/get-all-roles',
    GET_USERBYID: 'users/',
    UPDATE_USER: 'users/update/',
    DELETE_USER: 'users/update/',

    //Driver API 
    GET_DRIVER: 'driver/get-all-list',
    ADD_DRIVER: 'driver/add',
    GET_DRIVER_BY_ID: 'driver/',
    UPDATE_DRIVER: 'driver/update/',

    //Trip asign api
    ADD_TRIP: 'tripAssignment/add',
    GET_TRIP: 'tripAssignment/get-all-list',
    GET_TRIP_BY_ID: 'driver/get-trip/' ,
    GET_DRIVERROUTE_BYTRIPASSIGN_ID: 'driver/get-driverRoute-ByTripAssignmentId/',
    DRIVER_RECIEPT: 'driver/receipt/',
    TRIP_RECIEPT: 'tripAssignment/receipt',

    //Waste api
    GET_WASTE: 'master/get-waste-type',

    //service api
    GET_SERVICE: 'master/get-service-type',

    // Customer API
    GET_CUSTOMER: 'customer/get-all-list',
    ADD_CUSTOMER: 'customer/add',
    GET_CUSTOMERBYID: 'customer/',
    UPDATE_CUSTOMER: 'customer/update/',
    DELETE_CUSTOMER: 'customer/update/',
    GET_CUSTOMERR: 'customer/get-all-list',

    // Dashboard API
    GET_DRIVERCUSTOMERCOUNT: 'dashboard/get-card-count',

    //Vehicle API
    GET_VEHICLE: 'vehicle/get-all-list'
};