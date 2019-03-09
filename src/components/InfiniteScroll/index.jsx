import React from 'react'

export const withInfiniteScroll = (WrappedComponent) => {
    return class extends React.Component {
        componentDidMount = () => {
            window.addEventListener('scroll', this.onScroll, false)
        }

        componentWillUnmount = () => {
            window.removeEventListener('scroll', this.onScroll, false)
        }

        onScroll = () => {
            const {onPaginatedSearch, isLoading} = this.props
            const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
            const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight
            const clientHeight = document.documentElement.clientHeight || window.innerHeight

            if(Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
                !isLoading && onPaginatedSearch()
            }
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
}

export default withInfiniteScroll