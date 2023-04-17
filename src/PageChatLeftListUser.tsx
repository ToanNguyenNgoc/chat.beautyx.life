import { Link } from "react-router-dom";

export const PageChatLeftListUser = (props:any) => {
    const {users} = props
    return (
        <ul className="list-user">
            { 
                users.map((user:any) => (
                    <li key={user.id} className='detail-user'>
                        <Link 
                        className='item'
                        to={{pathname:`/chats/${user.id}`}}
                        >
                            <div className='item-left'>
                                <div className='item-dot'></div>
                                <div className='item-user'>
                                    <div className='item-avatar'>
                                        <img src={user.avatar} alt=""/>
                                        <div className='item-avatar-active'></div>
                                    </div>
                                    <div>
                                        <div>{user.name}</div>
                                        <div className='item-last-message'>{user.last_message}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='item-time'>{user.exit_time}</div>
                                <div><span className="badge badge-danger">Khách vip</span></div>
                            </div>
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
}