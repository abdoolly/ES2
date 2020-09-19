import { validate, cleanAttributes } from 'validate.js';

/**
 * @description validation function for the store data entered by the user
 * @param body 
 */
export const isValidStoreData = (body: any) => {
    const constraints = {
        id: {
            presence: {
                allowEmpty: false,
                message: `^id field is required`
            },
            type: 'string',
            format: {
                pattern: /([\da-zA-Z]+[-.,\w]*|[-.,\w]*[\da-zA-Z]+)/,
                flags: "i",
                message: "invalid identifier allowed symbols ('-' , ',' , '.' , '_') and alphanumeric"
            }
        },
        encryption_key: {
            presence: {
                message: `^encryption_key field is required`
            },
            type: 'string'
        },
        value: {
            presence: {
                allowEmpty: false,
                message: `^value field is required`
            },
            type: {
                type: (value: any) => typeof value === 'object',
                message: `^value field must be a JSON object`
            }
        }
    };

    let validator = validate(body, constraints, {
        fullMessages: true,
        format: 'grouped',
    });

    return {
        isValid: validator === undefined,
        attributes: cleanAttributes(body, constraints),
        errMsgs: validator
    };
};

/**
 * @description validation function for the retrieve data input by the user 
 * @param body 
 */
export const isValidRetrieveData = (body: any) => {
    const constraints = {
        id: {
            presence: {
                allowEmpty: false,
                message: `^id field is required`
            },
            type: 'string',
            format: {
                pattern: /([\da-zA-Z]+[-.,*\w]*|[-.,*\w]*[\da-zA-Z]+)[*-.,_]*/,
                flags: "i",
                message: "invalid identifier allowed symbols ('-' , ',' , '.' , '_') and alphanumeric"
            }
        },
        decryption_key: {
            presence: {
                allowEmpty: false,
                message: `^decryption_key is required`
            },
            type: 'string'
        }
    };

    let validator = validate(body, constraints, {
        fullMessages: true,
        format: 'grouped',
    });

    return {
        isValid: validator === undefined,
        attributes: cleanAttributes(body, constraints),
        errMsgs: validator
    };
};
