// // 40.1 예제
// var members = ['egoing', 'k8805', 'hoya'];
// console.log(members[1]);

// var i = 0;
// while (i < members.length) {
//     console.log('array loop', members[i]);
//     i += 1;
// }


// // 40.2 예제
// var roles = {
//     'programmer': 'egoing',
//     'designer': 'k8805',
//     'manager': 'hoya'
// };

// console.log(roles.designer);
// console.log(roles['designer']);

// for (var name in roles) {
//     console.log('object => ', name);
// }

// 40.3 예제
var roles = {
    'programmer': 'egoing',
    'designer': 'k8805',
    'manager': 'hoya'
};

console.log(roles.designer);
console.log(roles['designer']);

for (var name in roles) {
    console.log('object => ', name, '    value => ', roles[name]);
} // pair of key & value