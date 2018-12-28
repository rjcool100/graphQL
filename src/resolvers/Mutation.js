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
    deletePost(parent,args,{db},info){
        const postIndex= db.users.findIndex((post)=>{
            return post.id===args.id
        })
        if(postIndex==-1){
            throw new Error('the post does not exist')
        }
        var post= db.posts.splice(postIndex,1)

       
        db.comments= db.comments.filter((comment)=>{
            return comment.post!==args.id
        })
        return post[0]

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
    createPost(parent,args,{db},info){
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

        return post

    },
    createComment(parent,args,{db},info){
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

        return comment

    }
}


export {Mutation as default}