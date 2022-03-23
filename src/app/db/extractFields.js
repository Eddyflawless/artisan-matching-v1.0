module.exports.extractFields =  (form_data,fields=[]) => {

    if(fields.length == 0 || !fields) throw new Error("[Extract Fields] cannot have an empty fields selector")

    var white_listed_fields = {};
    Object.keys(form_data).forEach(field => {

        if(fields.includes(field)) {

            if(form_data[field])  // field must be defined 
                white_listed_fields[field] = form_data[field];
           
        }
    } )
    
    return white_listed_fields;

}