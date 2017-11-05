exports.rowValidation = {
    "type": "object",
    "required": true,
    "properties": {
        "ip_address": {
            "type": "string",
            "required": true,
            "minLength": 1
        },
        "country_code": {
            "type": "string",
            "required": true,
            "minLength": 1
        },
        "country": {
            "type": "string",
            "required": true,
            "minLength": 1
        },
        "city": {
            "type": "string",
            "required": true,
            "minLength": 1
        },
        "latitude": {
            "type": "string",
            "required": true,
            "minLength": 1
        },
        "longitude": {
            "type": "string",
            "required": true,
            "minLength": 1
        },
        "mystery_value": {
            "type": "string",
            "required": true,
            "minLength": 1
        }
    }

}