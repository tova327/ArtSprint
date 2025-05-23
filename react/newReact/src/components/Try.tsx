import React, { useState } from 'react';
import { Slider, Typography } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const { Paragraph } = Typography;

const GlassBox = styled(motion.div)`
  background: rgba(255,255,255,0.80);
  border-radius: 18px;
  box-shadow: 0 3px 20px 0 rgba(60,60,130,0.07);
  padding: 28px;
  margin: 22px 0;
`;

const Try: React.FC = () => {
  const [rows, setRows] = useState(1);

  const article =
    "To be, or not to be, that is the question: Whether it is nobler in the mind to suffer. The slings and arrows of outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. There 's the respect That makes calamity of so long life";

  return (
    <GlassBox
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Slider value={rows} min={1} max={10} onChange={setRows} />
      <Paragraph
        ellipsis={{
          rows,
          expandable: true,
          suffix: '--William Shakespeare',
          onEllipsis: (ellipsis) => {
            console.log('Ellipsis changed:', ellipsis);
          },
        }}
        title={`${article}--William Shakespeare`}
      >
        {article}
      </Paragraph>
    </GlassBox>
  );
};

export default Try;