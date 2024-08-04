// https://expressjs.com/en/guide/using-middleware.html => 공식 사이트

app.get('/user/:id', function (req, res, next) {
    // if the user ID is 0, skip to the next route
    if (req.params.id === '0') next('route')
    // otherwise pass the control to the next middleware function in this stack
    else next()
}, function (req, res, next) {
    // send a regular response
    res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', function (req, res, next) {
    res.send('special')
})

/*
0이면 special로 넘어가고, 아니라면 next()에 의해 바로 다음인 regular로 넘어간다.
둘 다 넘어간 다음에 next가 없으므로 미들웨어 종료
*/