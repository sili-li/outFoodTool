import '@babel/polyfill';
jest.mock('../src/_commons/utils/analysisHelper.ts', () => ({
    AnalysisPageView: jest.fn(),
    AnalysisTrack: jest.fn(),
    AnalysysAgent: {
        pageView: jest.fn(),
        track: jest.fn(),
        alias: jest.fn(),
        profileSet: jest.fn()
    },
    AnalysisUser: jest.fn()
}));


jest.spyOn(document, 'getElementById').mockImplementation(() => {
    return {
        scrollIntoView: jest.fn()
    };
});

jest.mock('../src/stores/index.ts', () => ({
    // getStore: jest.fn(() => ({
    //   getState: jest.fn(() => ({}))
    // })),
    getStore: jest.fn(),
    createStore: jest.fn()
}));

jest.mock('../src/_commons/components/Notification/index.tsx');

// add error tracking for jest
process.on('unhandledRejection', (reason) => {
    console.log('REJECTION', reason)
})