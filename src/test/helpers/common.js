const expect = require("chai").expect;

module.exports.expectThrowsAsync = async ( method, params, message ) => {

    let err = null;

    try {
        await method(...params);

    } catch (error) {
        err = error;
    }
    if (message) {
        expect(err.message).to.be.equal(message);
    } else {
        expect(err).to.be.an("Error");
    }
};

