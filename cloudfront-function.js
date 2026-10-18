function handler(event) {
    var request = event.request;
    var host = request.headers.host.value;
    var uri = request.uri;

    // www → non-www
    if (host === 'www.japandevguide.com') {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: 'https://japandevguide.com' + uri } }
        };
    }

    // Old Indonesian slugs → new English slugs
    var slugRedirects = {
        '/articles/cara-melamar-kerja-it-jepang.html': '/articles/how-to-get-it-job-japan.html',
        '/articles/bahasa-jepang-untuk-engineer.html': '/articles/japanese-for-engineers.html',
        '/articles/biaya-hidup-jepang.html': '/articles/cost-of-living-japan.html',
        '/articles/budaya-kerja-it-jepang.html': '/articles/it-work-culture-japan.html',
        '/articles/gaji-it-jepang.html': '/articles/it-salary-japan.html',
        '/articles/interview-it-jepang.html': '/articles/it-job-interview-japan.html',
        '/articles/karir-it-jepang.html': '/articles/it-career-japan.html',
        '/articles/kelebihan-tinggal-di-jepang.html': '/articles/why-live-in-japan-developer.html',
        '/articles/tech-stack-jepang.html': '/articles/tech-stack-japan.html',
        '/articles/top-perusahaan-it-jepang.html': '/articles/top-it-companies-japan.html',
        '/articles/visa-kerja-jepang.html': '/articles/it-work-visa-japan.html'
    };
    if (slugRedirects[uri]) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: 'https://japandevguide.com' + slugRedirects[uri] } }
        };
    }

    // /index.html → /
    if (uri === '/index.html') {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: 'https://japandevguide.com/' } }
        };
    }

    return request;
}
