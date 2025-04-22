import { TableLoader, Tables } from '../data/TableLoader';
import { Buff } from '../types';
import Tooltip from './Tooltip';
import { asset } from '../utils/utils';
import { useVertebrae } from '../utils/VertContext';

await TableLoader.load(['BuffShareLimitByGroupData', 'BuffShareLimitData','BattleBuffPerformData', 'BattleDictionaryData']);

interface RichTextProps {
  content: string | undefined;
  descriptionTips?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'subtitle1';
}

const RichText: React.FC<RichTextProps> = ({ content, descriptionTips, variant = 'body1' }) => {
  if (!content) {
    return <span className={getTextClass(variant)}>No description available.</span>;
  }
  return (
    <span className={getTextClass(variant)}>
      {parseUnityRichText(content, descriptionTips ?? '')}
    </span>
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
  const { vertebrae } = useVertebrae();
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
            Tables.BuffShareLimitByGroupData[parseInt(buffId[1].slice(3))]
            ? Tables.BattleBuffPerformData[Tables.BuffShareLimitData[Tables.BuffShareLimitByGroupData[parseInt(buffId[1].slice(3))].id[0]].buffList.split(',')[vertebrae].split(';')[0].split('-')[0]]
            : Tables.BattleBuffPerformData[parseInt(buffId[1])]
          : Tables.BattleDictionaryData[parseInt(buffId[1])];

      buff
        ? elements.push(
            <Tooltip
              key={index}
              title={
                <div>
                  <div className="flex items-center gap-2 pb-1">
                    {buff.iconName && (
                      <img
                        src={asset(`buffs/${buff.iconName}.png`)}
                        alt={buff.name}
                        className="w-8"
                      />
                    )}
                    <span className={getTextClass('subtitle1')} style={{ color }}>
                      {buff.name}
                    </span>
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
          )
        : elements.push(
            <span key={index} style={{ color: '#999999' }}>
              [Missing Text]
            </span>
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
