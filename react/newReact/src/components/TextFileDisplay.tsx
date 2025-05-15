
function TextFileDisplay({ fileUrl }: { fileUrl: string }) {
    

    
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
