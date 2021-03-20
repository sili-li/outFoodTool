import moment from 'moment'

export const formatTime = (time: any) => {
    return moment(new Date(time * 1000)).format(
        'yyyy-MM-DD hh:mm:ss'
    )
    // return new Date(time * 1000).Format('yyyy-MM-dd hh:mm:ss')
}


export const formatToDate = (time: any) => {
    return moment(new Date(time * 1000)).format(
        'yyyy-MM-DD'
    )
}
