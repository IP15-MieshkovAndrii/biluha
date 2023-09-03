import Head from 'next/head';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Box, Button, Container, Link, Paper, TextField, Typography } from '@mui/material';
import { posting, getPosts, logout } from '@/auth';
import {  useQuery, useQueryClient } from 'react-query';

interface SimplePost {
    id: any;
    content: any;
    author_id: any,
    profiles: { firstname: any; lastname: any };
  }


const SimplePosts: SimplePost[] = [
    {
      id: 1,
      content: 'Write first post',
      author_id: 0,
      profiles:{
        firstname:'No',
        lastname:'Posts',
    }
    },

  ];


export default function General() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const userDataString = Cookies.get('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const [postContent, setPostContent] = useState('')
    const [posts, setPosts] = useState(SimplePosts)
    const [userId, setUserId] = useState(0)
    const [type, setType] = useState('author')

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
    }, []);
  
    useEffect(() => {
        if (!userDataString) {
          router.push('/');
        }
        if(userData)setUserId(userData[0].id);
    }, [userDataString, router, userData]);



    const handleCreatePost = () => {
        if(postContent === '') return
        posting(userData[0].id, postContent)
        setPostContent('')
        queryClient.invalidateQueries('posts');
    };

    const { data: newPosts } = useQuery('posts', getPosts, {
        onSuccess: (data) => {
            if (data) {
                setPosts(data);
            }
        }
    });

    const handleLogout = () => {
        logout();
        localStorage.removeItem("profileType");
        Cookies.remove('userData');
        router.push('/');

    }

    return (
        <>
            <Head>
                <title>Biluha</title>
            </Head>
            <Button variant="contained" color="error" sx={{right: '5%', position: 'absolute', width: '10%'}} onClick={handleLogout}>
                    Logout
            </Button>
            <Container maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom>
                General Feed
                </Typography>
                {type === 'author' && (
                    <Paper elevation={5} sx={{marginBottom: "6vh"}}>
                        <Box p={2}>
                            <Typography variant="h6">Create a New Post</Typography>
                            <TextField
                                label="Post Content"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCreatePost}
                            >
                                Create Post
                            </Button>
                        </Box>
                    </Paper>
                )}

                    {posts.map((post) => (
                        <Paper key={post?.id} elevation={3} sx={{mb: '20px'}}>
                            <Box p={2}>
                                <div key={post?.id}>                        
                                    <Link href={`/author/${post.author_id}`}>
                                        <Typography variant="body2" 
                                            sx={{
                                                textAlign: userId === post.author_id ? 'right' : 'left',
                                                fontSize: '0.6rem'
                                            }}>
                                            {post?.profiles?.firstname} {post?.profiles?.lastname}
                                        </Typography>
                                    </Link>
                                    <Typography variant="body1">{post?.content}</Typography>
                                    <hr />
                                </div>
                            </Box>
                        </Paper>
                    ))}

            </Container>
        </>
    )
}
