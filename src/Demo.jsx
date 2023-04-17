export const Demo = (props) => {
    // const title = props.title
    const {title, products} = props

    return (
        <button>
            {title}
            <ul>
                {
                    products.map(item => (
                        <li key={item.id}>
                            {item.title}
                        </li>
                    ))
                }
            </ul>
        </button>
    )
}
// export default Demo;