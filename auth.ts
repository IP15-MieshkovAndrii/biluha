import { supabase } from "./supabase";

interface SignupFormInputs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
interface LoginFormInputs {
    email: string;
    password: string;
}

export const signup = async (userInfo: SignupFormInputs, profileType: string) => {
    let email = userInfo.email;
    let password = userInfo.password;
    let firstName = userInfo.firstName;
    let lastName = userInfo.lastName;
    try {
        const { data: existingUsers, error: existingUsersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userInfo.email);
  
        if (existingUsersError) {
          console.error('Error checking existing users:', existingUsersError.message);
          return;
        }
  
        if (existingUsers && existingUsers.length > 0) {
          console.error('User with the same email already exists.');
          return;
        }
  
        const { data, error } = await supabase.auth.signUp({ email, password });
  
        if (error) {
          console.error('Sign-up failed:', error.message);
        } else {

        const { error: insertError } = await supabase
            .from('profiles')
            .insert({ email, password, profile_type: profileType, firstname: firstName, lastname: lastName });
  
        if (insertError) {
            console.error('Error inserting user data:', insertError.message);
            return;
        }
  
          console.log('Sign-up successful:');
          return true;
        }
      } catch (error) {
        console.error('Sign-up failed:', error);
      }
};
  
export const login = async (userInfo: LoginFormInputs,) => {
    let email = userInfo.email
    let password = userInfo.password
    try {
        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            console.error('Login failed:', error);
        } else {
            let { data, error } = await supabase
                .from('profiles')
                .select('id, firstname, lastname, email, profile_type')
                .eq('email', email);
                if (error) {
                    console.error('Login failed:', error);
                }else {
                    console.log('Login successful!');
                    return data
                }
          }
    }catch(error){
        console.error('Login failed:', error);
    }
}
 
export const posting = async(author_id: number, content: string) => {
    try {

        const { data, error } = await supabase.from('posts').insert({author_id, content});
    
        if (error) {
          console.error('Error inserting post:', error);
          return;
        }
    
        
    } catch (error) {
        console.error('Error inserting post:', error);
    }
}

export const commenting = async(commentator_id: number, post_id: number, content: string) => {
    try {

        const { data, error } = await supabase.from('comments').insert({commentator_id, post_id, content});
    
        if (error) {
          console.error('Error inserting post:', error);
          return;
        }
    
        
    } catch (error) {
        console.error('Error inserting post:', error);
    }
}

export const getPosts = async () => {
    try {
        const { data, error } = await supabase
        .from('posts')
        .select(
          'id, content, author_id, profiles(firstname, lastname)'
        );

        const transformedData = data?.map((item) => ({
            id: item.id,
            content: item.content,
            author_id: item.author_id,
            profiles: {
              firstname: item.profiles.firstname,
              lastname: item.profiles.lastname,
            },
          }));


  
      if (error) {
        throw new Error(error.message);
      }
  
      return transformedData;
    } catch (error) {
        console.error(error);
    }
};

export const getComments = async (post_id: number) => {
    try {
        let { data, error } = await supabase
        .from('comments')
        .select(
          'id, content, commentator_id'
        )
        .eq('post_id',post_id)
        if (error) {
            throw new Error(error.message);
        }
  
        const newData = await Promise.all(
            data
            ? data.map(async (item) => ({
                ...item,
                fullName: await getName(item.commentator_id) || '',
              }))
            : []
        );
        return newData;
    } catch (error) {
        console.error(error);
    }
};

export const getSpecificPosts = async(author_id: number) => {
    try {
        const { data, error } = await supabase
        .from('posts')
        .select('id, content')
        .eq('author_id', author_id);

        const transformedData = data?.map((item) => ({
            id: item.id,
            content: item.content,
          }));

      if (error) {
        throw new Error(error.message);
      }
  
      return transformedData;
    } catch (error) {
        console.error(error);
    }
}

export const logout = async () => {
    try{
        let { error } = await supabase.auth.signOut()
    } catch(error){
        console.error(error);
    }
}

export const getName = async (id: number) => {
    try{
        const { data, error } = await supabase
        .from('profiles')
        .select('firstname, lastname')
        .eq('id', id);

        let fullname = '';
        if(data && data.length > 0)fullname = data[0].firstname + ' ' + data[0].lastname

        return fullname
    } catch(error){
        console.error(error);
    }
}


