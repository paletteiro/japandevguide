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
