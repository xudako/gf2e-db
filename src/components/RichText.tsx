import Tables from '../data/TableLoader';
import { Buff } from '../types';
import Tooltip from './Tooltip';

const dynamicBuffs = new Map([
  [1022, 102204013], //Sharkry
  [103209, 10320981], //Daiyan
  [104400, 310452], //Vector
  [340600, 340601], //Klukai
  [340700, 340701], //Klukai
  [10520800, 10520801], //Klukai
  [10510700, 105107001], //Mechty
  [10510800, 105108001], //Mechty
]);

interface RichTextProps {
  content: string | undefined;
  descriptionTips?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'subtitle1';
}

const RichText: React.FC<RichTextProps> = ({ content, descriptionTips, variant = 'body1' }) => {
  if (!content) {
    return <p className={getTextClass(variant)}>No description available.</p>;
  }
  return (
    <p className={getTextClass(variant)}>{parseUnityRichText(content, descriptionTips ?? '')}</p>
  );
};

const getTextClass = (variant: RichTextProps['variant'] = 'body1') => {
  const classes = {
    h1: 'text-4xl font-medium',
    h2: 'text-3xl font-medium',
    h3: 'text-2xl font-medium',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
    body1: 'text-base',
    body2: 'text-sm',
    caption: 'text-xs',
    subtitle1: 'text-base font-medium',
  };
  return classes[variant];
};

const parseUnityRichText = (content: string, descriptionTips: string): React.ReactNode => {
  const buffIds = descriptionTips.split(';').map((buffId) => buffId.split(':'));

  const regex = /<color=([#a-fA-F0-9]+)>(\{(\d+)\}(?:\([^)]*\))?|.*?)<\/color>/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  content.replace(regex, (match, color, text, _buffIndexStr, index) => {
    if (lastIndex < index) {
      elements.push(content.slice(lastIndex, index));
    }

    const buffIndexMatch = text.match(/^\{(\d+)\}/);
    if (buffIndexMatch) {
      const buffIndex = parseInt(buffIndexMatch[1]);
      const suffix = text.slice(buffIndexMatch[0].length);
      const buffId = buffIds[buffIndex];
      const buff: Buff =
        buffId[0] == '0'
          ? buffId[1].startsWith('-') &&
            parseInt(buffId[1].slice(3)) &&
            dynamicBuffs.has(parseInt(buffId[1].slice(3)))
            ? Tables.BattleBuffPerformData[dynamicBuffs.get(parseInt(buffId[1].slice(3)))!]
            : Tables.BattleBuffPerformData[parseInt(buffId[1])]
          : Tables.BattleDictionaryData[parseInt(buffId[1])];

      elements.push(
        <Tooltip
          key={index}
          title={
            <div>
              <div className="flex items-center gap-2 pb-1">
                {buff.iconName && (
                  <img
                    src={`${import.meta.env.BASE_URL}buffs/${buff.iconName}.png`}
                    alt={buff.name}
                    className="w-8"
                  />
                )}
                <p className={getTextClass('subtitle1')} style={{ color }}>
                  {buff.name}
                </p>
              </div>
              <hr className="border-gray-600" />
              <RichText
                content={buff.description}
                descriptionTips={buff.descriptionTips}
                variant="caption"
              />
            </div>
          }
        >
          <span style={{ color }} className="underline cursor-help">
            {buff.name}
          </span>
          <span style={{ color }}>{suffix}</span>
        </Tooltip>
      );
    } else {
      elements.push(
        <span key={index} style={{ color }}>
          {text}
        </span>
      );
    }
    lastIndex = index + match.length;
    return match;
  });
  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }
  return elements;
};

export default RichText;
