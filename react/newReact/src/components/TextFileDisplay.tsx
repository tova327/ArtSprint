import axios from 'axios';
import { useState, useEffect } from 'react';

function TextFileDisplay({ fileUrl }: { fileUrl: string }) {
    const [text, setText] = useState('');
    const [error, setError] = useState(null as any);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         try {
    //             const encodedFileUrl = encodeURIComponent(fileUrl); // Properly encode the URL
    //             const response = await axios.get(`https://localhost:7001/api/Painting/text-from-url?url=${encodedFileUrl}`);

    //             if (response.status !== 200) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             const textData = response.data.content;
    //             console.log("data *****" + textData);

    //             setText(textData);
    //         } catch (e) {
    //             console.error("Error fetching data:", e); // Log the full error
    //             setError(e);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [fileUrl]);

    // if (loading) {
    //     return <p>Loading text file...</p>;
    // }

    // if (error) {
    //     return <p>Error: {error.message}</p>;
    // }

    return (
        <div>
            <pre>
                <object
                    data={fileUrl}
                    width="200"
                    height="100">
                </object>
            </pre>
        </div>
    );
}

export default TextFileDisplay;
