import React, {useEffect} from 'react'
import {debounce} from 'lodash'

export const withInfiniteScroll = WrappedComponent => {
    const InfiniteScroll = ({onPaginatedSearch, isLoading, ...props}) => {
        useEffect(() => {
            window.addEventListener('scroll', onScroll, false)
            return () => window.removeEventListener('scroll', onScroll, false)
        })
        const debounced = debounce(onPaginatedSearch, 200)
        const onScroll = () => {
            const scrollTop =
                (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
            const scrollHeight =
                (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight
            const clientHeight = document.documentElement.clientHeight || window.innerHeight

            if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
                !isLoading && debounced()
            }
        }

        return <WrappedComponent {...props} />
    }
    return InfiniteScroll
}

export default withInfiniteScroll
