export default async function() {
    return {
        verbose: true,
        moduleFileExtensions: [ "js" ],
        runner: "jest-runner",
        testMatch: [
            "**/tests/**/*.test.js?(x)",
            "**/?(*.)+(spec|test).js?(x)"
        ],
        transform: {
            '\\.[jt]sx?$': 'babel-jest',
        },
        setupFilesAfterEnv: ['./jest.setup.js'],
    };
};