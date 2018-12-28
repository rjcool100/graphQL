const Query={
    greeting(parent,args,{db},info){
        if(args.name){
            return `hello ${args.name}`
        }
        else{
            return 'hello'
        }
    },
    users(parent,args,{db},info){
        return db.users
    },
    arr(){
        return [1,2,3]
    },
    posts(parent,args,{db},info){
        if(!args.query)
            return db.posts
        else{
            return db.posts.filter((post)=>{
                var namematch=post.name.toLowerCase().includes(args.query.toLowerCase())
                var topicmatch=post.topic.toLowerCase().includes(args.query.toLowerCase())
                return namematch||topicmatch
            })
        }
    },
    comments(parent,args,{db},info){
       return db.comments
    },
    add(parent,args,{db},info){
        if(args.numbers.length===0)
        {
            return 0;
        }
        else{
            return args.numbers.reduce((sum,item)=>{
                return sum+item
            })
        }

    },
     me(){
        return {
            id:'123',
            name:'rohit',
            age:26,
            employed:false,
            gpa:null,
            email:'test@gmail.com'
        }
    },
    post(){
        return{
            id:'234',
            name:'How to GraphQL',
            topic:'topic'
        }
    }
}

export {Query as default}