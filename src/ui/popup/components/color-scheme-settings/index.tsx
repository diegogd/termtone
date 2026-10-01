import {m} from 'malevic';

import type {ParsedColorSchemeConfig} from '../../../../utils/colorscheme-parser';
import type {Theme} from '../../../../definitions';
import {Select} from '../../../controls';

interface ColorSchemeSettingsProps {
    config: Theme;
    colorSchemes: ParsedColorSchemeConfig;
    onChange: (config: Partial<Theme>) => void;
}

export default function ColorSchemeSettings({config, colorSchemes, onChange}: ColorSchemeSettingsProps) {
    const isDarkScheme = config.mode === 1;
    const schemes = isDarkScheme ? colorSchemes.dark : colorSchemes.light;
    const names = Object.keys(schemes).sort((a, b) => a === 'Default' ? -1 : b === 'Default' ? 1 : a.localeCompare(b));
    const current = isDarkScheme ? config.darkColorScheme : config.lightColorScheme;

    function onSchemeChange(name: string) {
        const {backgroundColor, textColor} = schemes[name];
        onChange(isDarkScheme
            ? {darkColorScheme: name, darkSchemeBackgroundColor: backgroundColor, darkSchemeTextColor: textColor}
            : {lightColorScheme: name, lightSchemeBackgroundColor: backgroundColor, lightSchemeTextColor: textColor});
    }

    return (
        <section class="color-scheme-settings">
            <Select
                value={current}
                arrowKeys
                options={names.reduce((map, name) => {
                    map[name] = <div>{name}</div>;
                    return map;
                }, {} as {[name: string]: Malevic.Spec})}
                onChange={onSchemeChange}
            />
            <label class="color-scheme-settings__label">Color scheme</label>
        </section>
    );
}
