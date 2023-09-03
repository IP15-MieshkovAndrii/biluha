import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {  useQuery, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import { getName, getSpecificPosts, commenting, getComments, logout} from '@/auth';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Link,
} from '@mui/material';
import Head from 'next/head';

interface AuthorPost {
    id: any;
    content: any;
  }
interface Comment {
    fullName: string;
    id: any;
    content: any;
    commentator_id:any;
}


const AuthorPost: AuthorPost[] = [
    {
      id: 1,
      content: 'Write first post',
    },

  ];

const Comment: Comment[] = [
    {
        fullName: '',
        id: -1,
        content: '',
        commentator_id:'',
    },

  ];
export default function AuthorFeed(){
    const router = useRouter();
    const userDataString = Cookies.get('userData');
    const queryClient = useQueryClient();
    const { authorId } = router.query;
    const [posts, setPosts] = useState(AuthorPost);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] =  useState(Comment);
    const [selectedPost, setSelectedPost] = useState(0);
    const [type, setType] = useState('author')
    const [userId, setUserId] = useState(0);
    const [fullName, setFullName] = useState('')
    const [myName, setMyName] = useState(0)


    useEffect(() => {
        let profileType = localStorage.getItem('profileType');
        if (!profileType) {
            const userDataString = Cookies.get('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const userProfileType = userData[0].profile_type;
                localStorage.setItem('profileType', userProfileType);
                profileType = userProfileType
            }
        }
        if (profileType)setType(profileType);
        if (typeof authorId === 'string') {
            const authorIdNumber = parseInt(authorId, 10)
            setUserId(authorIdNumber)
        }


        const fetchName = async() =>{
            let newFullName = await getName(userId);
            if(typeof newFullName === 'string' && newFullName.length > 0)setFullName(newFullName)
        }
        fetchName();


 
    }, [authorId, userId]);

    useEffect(() => {
        if (!userDataString) {
        router.push('/');
        }
    }, [userDataString, router]);

    const { data: newPosts } = useQuery(['authorPosts', userId], () => getSpecificPosts(userId), {
        onSuccess: (data) => {
            if (data) {
                setPosts(data);
            }
    }})

    const { data: newComments } = useQuery(['comments', selectedPost], () => getComments(selectedPost), {
        onSuccess: (data) => {
            if (data) {
                setComments(data);
            }
    }})


  const handleAddComment = (postId: number) => {
    const userDataString = Cookies.get('userData') || '';
    const userData = JSON.parse(userDataString);
    setMyName(userData[0].id)
    commenting(userData[0].id, postId, commentContent)
    setCommentContent('');
    queryClient.invalidateQueries('comments');

  };
  const handlePostClick = async (id: number) => {
    const userDataString = Cookies.get('userData') || '';
    const userData = JSON.parse(userDataString);
    setMyName(userData[0].id)
    setSelectedPost(id);
  };
  const handleLogout = () => {
    logout();
    localStorage.removeItem("profileType");
    Cookies.remove('userData');
    router.push('/');

}

  return (
    <div>
        <Container maxWidth="md">
        <Head>
                <title>Biluha</title>
        </Head>
        <Button variant="contained" color="success" sx={{left: '5%', position: 'absolute', width: '10%', cursor: 'pointer'}}>
            <Link href={`/general`} style={{textDecoration: 'none',color: 'white',}}>
             Back
             </Link>
        </Button>
        <Button variant="contained" color="error" sx={{right: '5%', position: 'absolute', width: '10%', cursor: 'pointer'}} onClick={handleLogout}>
             Logout
        </Button>
        <Typography variant="h2" component="h1" gutterBottom>
          Author: {fullName}
        </Typography>

        {posts.map((post) => (
          <Paper key={post.id} elevation={3} sx={{ marginBottom: '2vh' }}>
            <Box p={2}>
                <Typography variant="body1">{post?.content}</Typography>
                <Link onClick={() => handlePostClick(post.id)} style={{cursor: 'pointer'}}>
                    View Comments
                </Link>
                {post.id === selectedPost && (
                    <>
                    {(comments.length > 0 && comments[0].id !== -1) &&
                        comments.map((comment)=>(
                            <Paper elevation={5} key={comment.id} sx={{mt: '10px'}}>
                                <Box p={2}>

                                    <div key={comment.id}>
                                        <Link href={`/author/${comment?.commentator_id}`}>
                                            <Typography
                                            variant="body2"
                                            sx={{
                                                textAlign:
                                                comment?.commentator_id  === myName
                                                    ? 'right'
                                                    : 'left',
                                                fontSize: '0.6rem',
                                            }}
                                            >{comment.fullName}
                                            </Typography>
                                        </Link>
                                        <Typography variant="body1">
                                        {comment.content}
                                        </Typography>
                                    </div>

                                </Box>
                            </Paper>
                        ))
                    }
                    {(type === 'commentator') ?(
                        <Box p={2}>
                        <Typography variant="h5">Post Comments</Typography>
                        <TextField
                        label="Add Comment"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        />
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddComment(post.id)}
                        >
                        Add Comment
                        </Button>
                    </Box>
                    ) : (
                        <></>
                    )
                    }

                    </>

                    )}
            </Box>
          </Paper>
        ))}

      </Container>
    </div>
  );

};

