import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProviders";
import useAxiosPublic from "../../hook/useAxiosPublic";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hook/useAxiosSecure";

const Register = () => {
    const { register, handleSubmit, formState:{errors}, reset } = useForm()
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const image_hosting_key= import.meta.env.VITE_IMAGE_HOSTING_KEY;

    const image_hosting_api=`https://api.imgbb.com/1/upload?key=${image_hosting_key}`

    const onSubmit = async(data) =>{
        const imageFile = { image: data.photo[0] }
        const res = await axiosSecure.post(image_hosting_api, imageFile, {
            headers:{
                'content-type':'multipart/form-data'
            }
        });

        if(res.data.success){
            const email = data.email;
            const password = data.password;
            const image = res.data.data.display_url;
            const phoneNumber = data.mobile;

        createUser(email, password)
        .then(res =>{
            
            updateUserProfile(data.name, image, phoneNumber)
            .then(()=>{
                const userInfo = {
                    name: data.name,
                    email: data.email,
                    role:'user',
                    phoneNumber:phoneNumber,
                    image:image
                }

                axiosPublic.post('/users',userInfo)
                .then(res => {
                    if(res.data.insertedId){
                        reset();
                        Swal.fire({
                            position:'center',
                            icon:'success',
                            title:'User created successfully',
                            showConfirmButton:false,
                            timer:1500
                        })
                        navigate('/')
                    }
                })

            })
        })

        }
        
    }
    return (
        <div>
            <div className="mx-auto md:w-1/3">
                <h2 className="text-3xl mb-6 text-center">Please Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register('name',{required:true})} placeholder="Your Name" className="border w-full mb-4 py-2 px-4" />
                    {
                        errors.name && <span className="text-red-500">Name is required</span>
                    }
                    <br />
                    <h2 className="text-xl">Profile Picture</h2>
                    <input {...register('photo',{required:true})} type="file" className="file-input w-full max-w-xs mb-3" />
                    {
                        errors.photo && <span className="text-red-500">Name is required</span>
                    }
                    <br />
                    <input type="text" {...register('mobile',{required: true})} placeholder="Mobile Number" className="border w-full mb-4 py-2 px-4"/>
                    {
                        errors.mobile && <span className="text-red-500">Mobile Number is required</span>
                    }
                    <br />
                    <input type="email" {...register('email', {required: true})} placeholder="Email" className="border w-full mb-4 py-2 px-4"/>
                    {
                        errors.email && <span className="text-red-500">Email is required</span>
                    }
                    <br />
                    <input type="password" {...register('password', {required: true, minLength:6, pattern:/(?=.*[A-Z])(?=.*[a-z])/ })} placeholder="Password" className="border w-full mb-4 py-2 px-4"/>
                    {
                        errors.password?.type ==='required' && <span className="text-red-500">Password must be required</span>
                    }
                    {
                        errors.password?.type ==='minLength' && <span className="text-red-500">Password must be at least six character</span>
                    }
                    {
                        errors.password?.type ==='pattern' && <span className="text-red-500">Password must be at least one upper case, one lower case</span>
                    }
                     <input className="btn btn-secondary w-full mb-4" type="submit" value="Register" />
                </form>
                <p className="text-center mb-5">Already Registered? Please <Link className="text-blue-500" to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;