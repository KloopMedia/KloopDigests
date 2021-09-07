import React, {useEffect, useState} from "react";
import {gql, useQuery} from '@apollo/client';
import {useHistory, useParams} from "react-router-dom";
import {format, parse, isValid, startOfYesterday} from "date-fns"; // theme css file
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";


const Digest = () => {
    const TODAY = format(new Date(), 'yyyy-MM-dd')
    console.log(format(startOfYesterday(), 'yyyy-MM-dd'))
    const YESTERDAY = format(startOfYesterday(), 'yyyy-MM-dd')
    const {date}: { date: string } = useParams()
    const history = useHistory()
    const [parsedDoc, setParsedDoc] = useState<any>(null)
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

    let query = gql(`
        query MyQuery($date: date) {
          mass_media_digest_kg(where: {digest_period: {_eq: "latest"}, digest_date: {_eq: $date}}) {
            digest_date
            digest_period
            digest_text
            digest_type
          }
        }
    `)

    if (date) {
        query = gql(`
        query MyQuery($date: date) {
          mass_media_digest_kg(where: {digest_type: {_eq: "combined"}, digest_date: {_eq: $date}}) {
            digest_date
            digest_period
            digest_text
            digest_type
          }
        }
    `)
    }

    let queryDate = TODAY
    if (date && (date.toLowerCase() === 'yesterday' || isValid(parse(date, 'yyyy-MM-dd', new Date())))) {
        if (date.toLowerCase() === 'yesterday') {
            queryDate = YESTERDAY
        } else {
            queryDate = date
        }
    }

    useEffect(() => {
        if (date && (date.toLowerCase() === 'yesterday' || isValid(parse(date, 'yyyy-MM-dd', new Date())))) {
            if (date.toLowerCase() === 'yesterday') {
                queryDate = YESTERDAY
            } else {
                queryDate = date
            }
        }
        setSelectedDate(new Date(queryDate))
    }, [queryDate])

    const {
        loading,
        data
    } = useQuery(query, {
        variables: {
            date: queryDate
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (data && data.mass_media_digest_kg.length > 0) {
            const {digest_text} = data.mass_media_digest_kg[0];
            setParsedDoc(digest_text)
        } else {
            setParsedDoc(`No Digest for ${parseDate(selectedDate)}`)
        }
    }, [data])

    const parseDate = (d: Date) => {
        return format(d, 'yyyy-MM-dd')
    }

    const handleDateChange = (pickedDate: Date | null) => {
        if (pickedDate) {
            if (isValid(pickedDate)) {
                const parsedDate = parseDate(pickedDate)
                setSelectedDate(pickedDate);
                history.push(`${parsedDate}`)
            }
        } else {
            setSelectedDate(new Date())
            history.push('')
        }
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <div style={{padding: 20}}>
                <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Дата"
                    format="yyyy-MM-dd"
                    value={selectedDate}
                    onChange={handleDateChange}
                    clearable
                    cancelLabel={"Отмена"}
                    okLabel={"ОК"}
                    clearLabel={"Очистить"}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                {loading ?
                    <p>loading</p>
                    :
                    <div dangerouslySetInnerHTML={{__html: parsedDoc}}>
                        {/*<div>*/}
                        {/*<iframe srcDoc={parsedDoc} sandbox={"allow-same-origin"} style={{*/}
                        {/*    width: "100%",*/}
                        {/*    height: "100%",*/}
                        {/*    position: "absolute",*/}
                        {/*    top: 0,*/}
                        {/*    left: 0,*/}
                        {/*    border: "none"*/}
                        {/*}}/>*/}
                    </div>
                }
            </div>
        </MuiPickersUtilsProvider>
    )
}

export default Digest