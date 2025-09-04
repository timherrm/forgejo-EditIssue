class ForgejoAPI {
    constructor(api_url, token, debug = false) {
        this.api_url = api_url;
        this.token = token;
        this.debug = debug;
    }

    async EditIssue(repository, index, assignees, body, due_date, milestone, ref, state, title, unset_due_date) {
        const requestBody = {};
        if (assignees) requestBody.assignees = assignees;
        if (body) requestBody.body = body;
        if (due_date) requestBody.due_date = due_date;
        if (milestone) requestBody.milestone = milestone;
        if (ref) requestBody.ref = ref;
        if (state) requestBody.state = state;
        if (title) requestBody.title = title;
        if (unset_due_date) requestBody.unset_due_date = unset_due_date;

        // Debug output
        if (this.debug) {
            console.log('EditIssue payload:', requestBody);
        }

        const response = await this._makeRequest(
            `/repos/${repository}/issues/${index}`,
            'PATCH',
            requestBody
        );
        return response.data;
    }

    async _makeRequest(endpoint, method, data) {
        const url = `${this.api_url}${endpoint}`;
        const options = {
            method,
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            data
        };

        if (this.debug) {
            console.log('ForgejoAPI request:', {
                url,
                method,
                headers: options.headers,
                data
            });
        }

        const axios = require('axios');
        return await axios(url, options);
    }
}

module.exports = ForgejoAPI;