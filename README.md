# voice-notes
A webapp made with react for taking voice notes created as part of 36 hour hackathon.

#### [checkout live in production](https://voice-notes.abhi887.vercel.app)

## About
`voice-notes` is a webapp that helps you keep track of your thoughts or ideas in the form of voice notes/memos.
As of now it has no backend at all and uses `idb-keyval` database which is simple key-value database built on
top IndexedDB of the browser. As all the data is stored locally, you'll never have to worry about it leaving your
device.

## Downloads
[Android](https://github.com/abhi887/voice-notes/blob/main/bin/voice%20notes.apk)

## Prerequisites (for development)
- [Nodejs](nodejs.org)
- [npm](npmjs.org)

## How to setup & run
1. `git clone` or `download` this repository
2. `cd voice-notes`
3. `npm install`
4. `npm start`

## Tested on browsers
- [Chrome](https://www.google.com/chrome/)
- [Firefox](https://www.mozilla.org/en-US/firefox/new/?redirect_source=firefox-com)

## limitations
- `voice-notes`'s use of IndexedDB can cause functionality issue on browsers with either partial implementation
or complete lack of it.
- `voice-notes` on lower level uses HTML5 MediaRecorder API to record audio, which is not widely supported on smartphone
browsers which could cause issues related to voice recording.
