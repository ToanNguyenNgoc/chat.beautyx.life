
import { Outlet, useParams } from 'react-router-dom';
import './Chat.css';
import PageChatLeft from './PageChatLeft';
import { useMediaQuery } from 'react-responsive';
import queryString from 'query-string';

interface QueryParams {
    token?: string
}

export default function Chat() {
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 767px)'
    })
    const params = useParams()
    const query = queryString.parse(window.location.search) as QueryParams;
    console.log(query.token);

    return (
        <div>
            <div className="col-lg-12 pt-3">
                <div className='page'>
                    <div className="row">
                        <div
                            className="col-md-4 col-xs-12 no-pr chat-left"
                            style={(params.id && !isDesktopOrLaptop) ? { display: 'none' } : {}}
                        >
                            <div className="list-shortcuts">
                                <div className="icon-shortcut">
                                    <div className='icon-shortcut_btn' onClick={() => window.open("http://myspa.local", "_blank")}>
                                        <i className="fa fa-home fa-lg" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="icon-shortcut">
                                    <div className='icon-shortcut_btn' onClick={() => window.open("http://myspa.local/ManageUser/member_list", "_blank")}>
                                        <i className="fa fa-users fa-lg" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="icon-shortcut">
                                    <div className='icon-shortcut_btn' onClick={() => window.open("http://myspa.local/ManageAppointment/list", "_blank")}>
                                        <i className="fa fa-calendar fa-lg" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="icon-shortcut">
                                    <div className='icon-shortcut_btn' onClick={() => window.open("http://myspa.local/ManageOrder/order_list", "_blank")}>
                                        <i className="fa fa-shopping-bag fa-lg" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <PageChatLeft />
                        </div>
                        <div
                            className="col-md-8 col-xs-12 no-pl show chat-right"
                            style={(params.id && !isDesktopOrLaptop) ? { display: 'block' } : {}}
                        >
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}