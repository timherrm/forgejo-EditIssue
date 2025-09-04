const core = require('@actions/core');
const ForgejoAPI = require('./forgejo');

async function run() {
    try {
        const api_url = core.getInput('api_url');
        const token = core.getInput('token');
        const repository = core.getInput('repository');
        const index = core.getInput('index');

        const assigneesInput = core.getInput('assignees');
        const assignees = assigneesInput
            ? assigneesInput.split(',').map(a => a.trim()).filter(Boolean)
            : undefined;

        const body = core.getInput('body');

        let due_date = core.getInput('due_date');
        if (due_date && /^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
            due_date = `${due_date}T23:59:59+01:00`;
        }

        const milestone = Number(core.getInput('milestone'));
        let ref = core.getInput('ref');
        if (ref && !ref.startsWith('refs/heads/')) {
            ref = `refs/heads/${ref}`;
        }
        const state = core.getInput('state');
        const title = core.getInput('title');
        const unset_due_date = core.getInput('unset_due_date') === 'true';
        const debug = core.getInput('debug') === 'true';

        const forgejo = new ForgejoAPI(api_url, token, debug);

        let result;

        result = await forgejo.EditIssue(
            repository,
            index,
            assignees,
            body,
            due_date,
            milestone,
            ref,
            state,
            title,
            unset_due_date
        );
        core.setOutput('result', JSON.stringify(result, null, 2));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();