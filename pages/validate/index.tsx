import styles from '../../styles/Home.module.css'
import { Card,Box,IconButton, InputAdornment, Typography,TextField, Button,Grid, Checkbox, } from "@mui/material"
import Logo from '../../images/logo.svg'

import Lock from '@mui/icons-material/Lock'
import Person from '@mui/icons-material/Person'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CustomBtn from '../../components/CustomBtn/Button'
import axios from '../../helpers/axios'
import {useState} from 'react'
import useToast from '../../hooks/useToast'
import Spinner from '../../components/Spinner'
import { getTokenorEmptyString } from '../../helpers/auth.helper'
import { useRouter } from 'next/dist/client/router'



type ValidateResponseType = {
    "isValid": boolean,
    "user": null | any
}[]

const ValidateUser= ()=>{
    const [foundMember,setFoundMember] = useState<ValidateResponseType>();
    const {notify } = useToast();
    const route = useRouter()
    const [data,setData]= useState<string>()
    const [email,setEmail]= useState<string>()
    const [loading,setLoading] = useState(false)
    const checkValidatedMember = async ()=>{
        // if(getTokenorEmptyString()!=='.'){
        //     notify('You Have Been Verified already','error')
        //     return 
        // }
        if(!data){
            notify("Membership Number can't Can't be blant",'error')
            return 
        }
        if(!email){
            notify("Email can't be empty",'error')
            return 
        }
        setLoading(true)
        try{
            const resp:any = await axios.post(`/tenant/auth/ManageMemberValidation/validate_email/`,{'MEMBERSHIP_NO':data,email})
            const resp_data:ValidateResponseType =resp.data.data
            // setFoundMember(resp.data.data)
            setLoading(false)
            if(resp_data[0].isValid==false){
                notify('Member Not Found','error')
            }
       
            else{
                notify('Validation Successfull','success')
                notify('Please hold on','success')
                localStorage.setItem('validatedUser',JSON.stringify(resp_data[0].user))
                localStorage.setItem('validatedEmail',email)
                route.push('/validate/create')
            }
        }
        catch(err:any){
            setLoading(false)
            console.log(err)
            notify(err.response.data.message.error as string,'error')
        }
    }
    return (
        <Grid className={styles.loginBg}  style={{'height':'100vh'}}  >
            {
                loading?
                <Spinner/>:''
            }
      <br/>
      
      <Grid item md={12} className={styles.card} sm={10}  style={{margin:'0 auto','maxWidth':'450px'}} >
      <div style={{'width':'80px','margin':'0 auto'}}>
         <img src={Logo.src} style={{'width':'100%','height':'100%'}}/>
     </div>
          <Typography className='text' textAlign='center' marginBottom={2} fontWeight='bolder' >Validate Acct</Typography>
         <Typography 
         style={{'color':'rgb(46, 55, 21)'}}
         className='text' fontWeight='normal' textAlign='center' marginBottom={2} variant='subtitle2' color='InactiveCaption'>
        You must validate as a member to proceed registeration
         </Typography>
         <br/>
                  
          <Grid>
              <>
              <TextField 
              placeholder='MEMBERSHIP NO' 
              onChange={e=>setData(e.target.value)}
              // label='Username'  
              style={{width:'100%'}} size='small'
              InputProps={{
              
                  startAdornment:(
                      <Person color='disabled'  fontSize={'medium'}/>
                  )
              }}
              />
    <br />
    <br />
            <TextField 
              placeholder='Recognize company  mail' 
              onChange={e=>setEmail(e.target.value)}
              // label='Username'  
              style={{width:'100%'}} size='small'
              InputProps={{
              
                  startAdornment:(
                      <Person color='disabled'  fontSize={'medium'}/>
                  )
              }}
              />
              </>
              
          </Grid>
        <CustomBtn onClick={checkValidatedMember} style={{'width':'200px','margin':'10px auto'}}>
        Validate
        </CustomBtn>
          {/* <GreenButton text='Login' /> */}
          {/* <Button variant='contained' size='large' className={styles.button}>Login</Button> */}
      </Grid>
      <br/>
      </Grid>
    )
}


export default ValidateUser