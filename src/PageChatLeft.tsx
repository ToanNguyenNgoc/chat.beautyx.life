import {PageChatLeftListUser} from './PageChatLeftListUser';

export default function PageChatLeft() {
    const users = [
        { id: 1, 'name': 'Sói cô độc', 'avatar': 'http://myspa.local/files//avatar/20230217023406.jpg', 'last_message': 'You: Hello con sói cô độc', 'exit_time': '10min ago' },
        { id: 2, 'name': 'Gấu chó', 'avatar': 'https://devapi.myspa.vn/media/10084/277763215_543969187157980_5261600049025341561_n.jpeg?v=1678373000', 'last_message': 'Hello gấu chó', 'exit_time': '5min ago' },
    ];
    return (
        <div className='page-left'>
            <div className='page-left-head'>
                <div className='head-title'>
                    <h3>Chats</h3>
                    <div className='head-title-icon'>
                        <button type="button" className="btn btn-light"><i className="fa fa-bell-o" aria-hidden="true"></i></button>
                        <button type="button" className="btn btn-light" disabled><i className="fa fa-video-camera" aria-hidden="true"></i></button>
                        <button type="button" className="btn btn-light"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div className='head-search'>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search"/>
                    </div>
                </div>
            </div>
            <div className='page-left-classify'>
                <div className='active'>Inbox</div>
                <div>Communities</div>
            </div>
            <div className='page-left-list'>
                <PageChatLeftListUser users={users} />
            </div>
        </div>
    );
}