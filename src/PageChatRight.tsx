import { Link } from "react-router-dom";
import moment from "moment";

const messages = [
    {
        id: 1,
        user_id: 1,
        name: 'Customer name',
        body: 'Aside from staying in touch about your plans for tonight and sending crucial updates about adorable dogs you find on Instagram, texting your partner can be a great way to remind them why you`ve chosen one another, why you care about each other, and why — even through all couples face challenges',
        created_at: '2023-05-18 20:00:00',
    },
    {
        id: 2,
        user_id: 2,
        name: 'Customer name',
        body: 'T Aside from staying in touch about your plans for tonight',
        created_at: '2023-05-18 20:03:00',
    },
    {
        id: 3,
        user_id: 2,
        name: 'Customer name',
        body: 'T Aside from staying in touch about your plans for tonight and sending crucial updates about adorable dogs you find on Instagram, texting your partner can be a great way to remind them why you`ve chosen one another, why you care about each other',
        created_at: '2023-05-18 20:06:00',
    },
    {
        id: 4,
        user_id: 1,
        name: 'Customer name',
        body: 'Aside from staying in touch',
        created_at: '2023-05-18 20:09:00',
    },
    {
        id: 5,
        user_id: 2,
        name: 'Customer name',
        body: 'T Aside from staying in touch about your plans for tonight and sending crucial updates about adorable dogs you find on Instagram, texting your partner can be a great way to remind them why you`ve chosen one another',
        created_at: '2023-05-18 20:12:00',
    },
    {
        id: 6,
        user_id: 1,
        name: 'Customer name',
        body: 'Aside from staying in touch',
        created_at: '2023-05-18 20:09:00',
    },
    {
        id: 7,
        user_id: 2,
        name: 'Customer name',
        body: 'T Aside from staying in touch about your plans for tonight and sending crucial updates about adorable dogs you find on Instagram, texting your partner can be a great way to remind them why you`ve chosen one another',
        created_at: '2023-05-18 20:12:00',
    }
]

export default function PageChatRight() {
    const user_id = 2
    return (
        <div className='page-right'>
            <div className='page-right-head'>
                <div className='head-user'>
                    <div className='head-back'>
                        <Link
                            to={{ pathname: `/chats` }}
                        >
                            <img src="https://beautyx-spa.web.app/static/media/chevron-left.ac52a0ac09a2c0f64c752c5b4d237b5c.svg" alt="" />
                        </Link>
                    </div>
                    <div className='head-avatar'>
                        <img src="http://myspa.local/files//avatar/20230217023406.jpg" alt="" />
                    </div>
                    <div>
                        <div className='head-username'>
                            <div className='head-name'>Sói cô đơn</div>
                            <div className='head-status'>
                                <span></span>
                                <span>Online</span>
                            </div>
                        </div>
                        <div>@soicodon</div>
                    </div>
                </div>
                <div className='call'>
                    <button type="button" className="btn btn-link"><i className="fa fa-phone" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-link" disabled><i className="fa fa-video-camera" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-link"><i className="fa fa-exclamation" aria-hidden="true"></i></button>
                </div>
            </div>
            <div className='page-right-message'>
                <div className="message-cnt">
                    <ul className="message-list">
                        {
                            messages.map(item => (
                                <li key={item.id} className="message-item-cnt">
                                    <div className={item.user_id === user_id ? "body body_user" : "body"}>
                                        <div
                                            className={
                                                item.user_id === user_id ?
                                                    "body-message body-message_user" :
                                                    "body-message"
                                            }>
                                            {
                                                user_id !== item.user_id &&
                                                <div className="user-avatar">
                                                    <img src="https://devapi.myspa.vn/media/10084/277763215_543969187157980_5261600049025341561_n.jpeg?v=1678373000" alt="" />
                                                </div>
                                            }
                                            <div className="message-item-right">
                                                {user_id !== item.user_id && <p className="user-name">Gấu chó</p>}
                                                <p
                                                    className={
                                                        item.user_id === user_id ?
                                                            "body-text body-text_user" :
                                                            "body-text"
                                                    }
                                                >
                                                    {item.user_id}-{item.body}
                                                </p>
                                                <p className="message-item-create">
                                                    {moment(item.created_at).format('HH:mm DD/MM/YY')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <div className='page-right-foot'>
                <div className='list-icon'>
                    <button type="button" className="btn btn-link"><i className="fa fa-plus" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-link"><i className="fa fa-file-image-o" aria-hidden="true"></i></button>
                </div>
                <div className='content'>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Aa" />
                        <button type="button" className="btn btn-link"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div className='icon-like'>
                    <button type="button" className="btn btn-link"><i className="fa fa-thumbs-up" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    );
}