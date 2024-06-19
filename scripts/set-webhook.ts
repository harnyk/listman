import axios from 'axios';
import { fail, ok } from 'node:assert';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const home = process.env.HOME ?? fail('HOME not found');
const configPath = path.join(home, '.local/share/com.vercel.cli/auth.json');

async function getToken(): Promise<string> {
    let config;
    try {
        config = JSON.parse(await fs.readFile(configPath, 'utf8'));
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }

    return config?.token ?? process.env.VERCEL_TOKEN ?? fail('Token not found');
}

async function getProjectId(): Promise<string> {
    const data = JSON.parse(
        await fs.readFile(
            path.join(process.cwd(), './.vercel/project.json'),
            'utf8'
        )
    );

    return (
        data.projectId ??
        process.env.VERCEL_PROJECT_ID ??
        fail('Project ID not found')
    );
}

interface GetSetupUrlParams {
    target: 'production' | 'preview';
    projectId: string;
    token: string;
}

export async function getSetupUrl({
    target,
    projectId,
    token,
}: GetSetupUrlParams): Promise<string> {
    const response = await axios.get(
        `https://api.vercel.com/v6/now/deployments`,
        {
            params: { target, projectId },
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    const { data } = response;

    const deployment = data.deployments[0];

    return `https://${deployment.url}/api/tg/setup`;
}

interface GetTgVercelKeyParams {
    token: string;
    projectId: string;
    target: 'production' | 'preview';
}

async function getEnv(
    envName: string,
    { token, projectId, target }: GetTgVercelKeyParams
): Promise<string> {
    // /v1/projects/{idOrName}/env/{id}
    const response = await axios.get(
        `https://api.vercel.com/v9/projects/${projectId}/env`,
        {
            params: { decrypt: true },
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    const {
        data: { envs },
    } = response;

    const envVarDesc = envs.find((env) => env.key === envName);

    if (!envVarDesc) {
        fail(`Environment variable ${envName} not found`);
    }

    if (envVarDesc.target !== target && !envVarDesc.target.includes(target)) {
        fail(
            `Environment variable ${envName} found for target ${envVarDesc.target} but the requested target is ${target}`
        );
    }

    const envId = envVarDesc.id;
    const { data: decryptedEnv } = await axios.get(
        `https://api.vercel.com/v1/projects/${projectId}/env/${envId}`,
        {
            params: { decrypt: true },
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    ok(decryptedEnv.decrypted, 'Environment variable decryption failed');

    return decryptedEnv.value;
}

async function callSetupEndpoint(setupUrl: string, tgVercelKey: string) {
    const { data: response } = await axios.post(
        setupUrl,
        {},
        { params: { key: tgVercelKey } }
    );
    return response;
}

const target = process.argv[2] ?? fail('Target not provided');
if (target !== 'production' && target !== 'preview') {
    fail('Target must be "production" or "preview"');
}

const projectId = await getProjectId();
const token = await getToken();
const setupUrl = await getSetupUrl({
    target,
    projectId,
    token,
});
const tgVercelKey = await getEnv('TGVERCEL_KEY', {
    projectId,
    token,
    target,
});

console.log('Going to call setup endpoint:', setupUrl);
const response = await callSetupEndpoint(setupUrl, tgVercelKey);
console.log(JSON.stringify(response, null, 2));
