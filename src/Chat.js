
import { Outlet, useParams } from 'react-router-dom';
import './Chat.css';
import PageChatLeft from './PageChatLeft';
import PageChatRight from './PageChatRight';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function MyApp() {
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 767px)'
      })
      const params = useParams()
    // console.log(isDesktopOrLaptop)
    // const [orgs, setOrgs] = useState([])
    // console.log(params.id)
    // const getOrgs = async () =>{
    //     const reponse = await axios.get('https://devapi.myspa.vn/v1/organizations')
    //     setOrgs(reponse.data.context.data)
    // }
    // useEffect(()=>{
    //     getOrgs()
    // },[])
    return (
        <div>
            <div className="col-lg-12 pt-3">
                <div className='page'>
                    <div className="row">
                        <div
                            className="col-md-4 col-xs-12 no-pr chat-left"
                            style={(params.id && !isDesktopOrLaptop) ? {display:'none'} : {}}
                        >
                            <div className="list-shortcuts">
                                <div className="icon-shortcut">
                                    <a href="http://myspa.local" target="_blank"><i class="fa fa-home fa-lg" aria-hidden="true"></i></a>
                                </div>
                                <div className="icon-shortcut">
                                    <a href="http://myspa.local/ManageUser/member_list" target="_blank"><i class="fa fa-users fa-lg" aria-hidden="true"></i></a>
                                </div>
                                <div className="icon-shortcut">
                                    <a href="http://myspa.local/ManageAppointment/list" target="_blank"><i class="fa fa-calendar fa-lg" aria-hidden="true"></i></a>
                                </div>
                                <div className="icon-shortcut">
                                    <a href="http://myspa.local/ManageOrder/order_list" target="_blank"><i class="fa fa-shopping-bag fa-lg" aria-hidden="true"></i></a>
                                </div>
                            </div>
                            <PageChatLeft />
                        </div>
                        <div
                            className="col-md-8 col-xs-12 no-pl show chat-right"
                            style={(params.id && !isDesktopOrLaptop) ? {display:'block'} : {}}
                        >
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}