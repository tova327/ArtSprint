import styled from 'styled-components';

const GlassText = styled.div`
  background: rgba(255,255,255,0.25);
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(60,60,130,0.06);
  padding: 16px;
  margin: 8px 0;
`;

function TextFileDisplay({ fileUrl }: { fileUrl: string }) {
    return (
        <GlassText>
            <pre style={{ margin: 0 }}>
                <object
                    data={fileUrl}
                    width="200"
                    height="100"
                />
            </pre>
        </GlassText>
    );
}

export default TextFileDisplay;