import uuidv4 from 'uuid/v4'

const Mutation={
    createUser(parent,args,{db},info){
        const emailTaken=db.users.some((user)=>{
            return user.email===args.data.email
        })
        if(emailTaken){
            throw new Error('the email is already taken')
        }
        const user={
            id:uuidv4(),
            ...args.data
        }
        db.users.push(user)
        return user

    },
    deleteUser(parent,args,{db},info){
        const userIndex= db.users.findIndex((user)=>{
            return user.id===args.id
        })
        if(userIndex==-1){
            throw new Error('the user does not exist')
        }
        var user= db.users.splice(userIndex,1)
        db.posts= db.posts.filter((post)=>{
            var match=post.author===args.id

            if(match){
                comments= db.comments.filter((comment)=>{
                    return comment.post!==post.id
                })
            }
            return !match
        })
        db.comments= db.comments.filter((comment)=>{
            return comment.author!==args.id
        })
        return user[0]

    },
    updateUser(parent,args,{db},info){
        const {id,data}=args
        const user= db.users.find((user)=>{
            return user.id===id
        })
        if(user){
            if(typeof(data.email)==='string'){
                const emailTaken=db.users.some((user)=>{
                    return user.email===data.email
                })
                if(emailTaken){
                    throw new Error('the email is already taken')
                }

                user.email=data.email
            }

            if(typeof(data.name)==='string'){
                user.name=data.name
            }

            if(typeof(data.age)!=='undefined'){
                user.age=data.age
            }

            return user

        }
        else{
            throw new Error('the user does not exist')
        }
    },
    createPost(parent,args,{db,pubsub},info){
        const userExists= db.users.some((user)=>{
            return user.id===args.data.author
        })
        if(!userExists){
            throw new Error('the user does not exist')
        }
        const post={
            id:uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        var topic='posts';
        pubsub.publish(topic,{post:{
            mutation:'CREATED',
            data:post
        }})
        return post

    },
    deletePost(parent,args,{db,pubsub},info){
        const postIndex= db.posts.findIndex((post)=>{
            return post.id===args.id
        })
        if(postIndex==-1){
            throw new Error('the post does not exist')
        }
        var [post]= db.posts.splice(postIndex,1)
        db.comments= db.comments.filter((comment)=>{
            return comment.post!==args.id
        })
        var topic='posts';
        pubsub.publish(topic,{post:{
            mutation:'Deleted',
            data:post
        }})
        return post

    },
    updatePost(parent,args,{db},info){
        const {id,data}=args
        const post= db.posts.find((post)=>{
            return post.id===id
        })
        if(post){
            if(typeof(data.name)==='string'){
                post.name=data.name
            }

            if(typeof(data.topic)==='string'){
                post.topic=data.topic
            }

            return post
        }
        else{
            throw new Error('post not found')
        }
    },
    createComment(parent,args,{db,pubsub},info){
        const userExists= db.users.some((user)=>{
            return user.id===args.data.author
        })
        const postExists= db.posts.some((post)=>{
            return post.id===args.data.post
        })
        if(!userExists){
            throw new Error('the user does not exist')
        }
        if(!postExists){
            throw new Error('the post does not exist')
        }
        const comment={
            id:uuidv4(),
            ...args.data
        }
        db.comments.push(comment)
        var topic=`comment ${args.data.post}`;
        pubsub.publish(topic,{comment})
        return comment
    },
    deleteComment(parent,args,{db},info){
        const commentIndex= db.users.findIndex((comment)=>{
            return comment.id===args.id
        })
        if(commentIndex==-1){
            throw new Error('the comment does not exist')
        }
        var comment= db.comments.splice(commentIndex,1)
        return comment[0]
    },
    updateComment(parent,args,{db},info){
        const {id,data}=args
        const comment= db.comments.find((comment)=>{
            return comment.id===id
        })
        if(comment){
            if(typeof(data.text)==='string'){
                comment.text=data.text
            }
            return comment
        }
        else{
            throw new Error('comment not found')
        }
    }
}


export {Mutation as default}