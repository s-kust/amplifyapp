import { SecretsManager } from "aws-sdk";

export default function getApiUrl() {
    const region = process.env.REACT_APP_AWS_REGION;
    const config = {
        region: region,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
    const client = new SecretsManager(config);

    const SecretId = "portfolio_spreadsheet";
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: SecretId }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const secretsJSON = JSON.parse(data.SecretString);
                resolve(secretsJSON['portfolio_api_endpoint']);
            }
        });
    });
};