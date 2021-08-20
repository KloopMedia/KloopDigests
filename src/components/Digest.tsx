import React, {useEffect, useState} from "react";
import {gql, useQuery} from '@apollo/client';
import {useParams} from "react-router-dom";
import {format} from "date-fns"; // theme css file


const Digest = () => {
    const TODAY = format(new Date(), 'yyyy-MM-dd')
    const {date}: { date: string } = useParams()
    const [parsedDoc, setParsedDoc] = useState<any>(null)

    const query = gql(`
        query MyQuery($date: date) {
          mass_media_digest_kg(where: {digest_type: {_eq: "combined"}, digest_date: {_eq: $date}}) {
            digest_date
            digest_period
            digest_text
            digest_type
          }
        }
    `)

    const {
        loading,
        error,
        data,
        refetch
    } = useQuery(query, {
        variables: {
            date: date ?? TODAY
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        console.log(data)
        if (data) {
            const {digest_text} = data.mass_media_digest_kg[0];

            setParsedDoc(digest_text)
        }
    }, [data])

    return (
        <div>
            {loading ?
                <p>loading</p>
                :
                <div>
                    <iframe srcDoc={parsedDoc} style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        border: "none"
                    }}/>
                </div>
            }
        </div>
    )
}

export default Digest