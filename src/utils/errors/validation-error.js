const AppError=require('./error-handler');
const {StatusCodes}=require('http-status-codes');

class ValidationError extends AppError{
    constructor(error){
        let errorName=error.name;
        let explanation=error.message;
        // error.errors.forEach((err) => {
        //     explanation.push(err.message);
            
        // });
        super(
            errorName,
            'Not able to validate the data,missing parameters',
            explanation,
            StatusCodes.BAD_REQUEST
        )

    }
}
module.exports=ValidationError;