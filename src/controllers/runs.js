import { Config, debugApp } from '../config.js';
import ApiGithub from '../apiGithub.js';
import RunsModel from '../models/runs.js';

class RunsController {
    constructor () {
        const { token, owner, repo } = Config.globals;

        this._apiGithubObj = new ApiGithub(token);
        this._owner = owner;
        this._repo = repo;
        this._model = new RunsModel();
    }

    async renderRuns (ctx) {

        const listWFRuns   = await this._apiGithubObj.getListRuns(this._owner, this._repo);
        const runsKey      = 'workflow_runs';

        this._model.runs = listWFRuns[runsKey] || [];

        debugApp(`Runs count: ${this._model.runs.length}`);

        const locals = {
            columns: [
                'id',
                'name',
                'head_branch',
                'run_number',
                'status',
                'conclusion',
                'workflow_id',
                'created_at'
            ],
            values: this._model.runs,
        };

        await ctx.render('index', locals, true);
    }
}

export default RunsController;
