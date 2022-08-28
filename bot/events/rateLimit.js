module.exports = {
    name: "rateLimit",
    once: false,
    execute(rateLimitData) {
        /**
         * Triggered when the client hits a rate limit
         * @param {RateLimitData} rateLimit
         * @returns {Promise<void>}
         * @see https://discord.js.org/#/docs/main/stable/typedef/RateLimitData
         */
        console.log("RATELIMIT : ", rateLimitData);
    }
}