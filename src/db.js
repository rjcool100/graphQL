const posts=[{
    id:'1',
    name:'post1',
    topic:'topic1',
    author:'1' 
},
{
    id:'2',
    name:'post2',
    topic:'topic2',
    author:'3'  
},
{
    id:'3',
    name:'post3',
    topic:'topic3',
    author:'1'    
}]

const users=[{
    id:'1',
    name:'user1',
    email:'user1@gmail.com'
},
{
    id:'2',
    name:'user2',
    email:'user2@gmail.com'   
},
{
    id:'3',
    name:'user3',
    email:'user3@gmail.com'
}]

const comments=[{
    id:'1',
    text:'comment1',
    author:'1',
    post:'1'
},
{
    id:'2',
    text:'comment2',
    author:'2',
    post:'3'
},
{
    id:'3',
    text:'comment3',
    author:'2',
    post:'3'
},
{
    id:'4',
    text:'comment4',
    author:'2',
    post:'2'
}]

const db={
    users,
    posts,
    comments
}


export {db as default}