import React from 'react'
import PropTypes from 'prop-types'
import Block from 'core/components/Block'
import TextBlock from 'core/blocks/TextBlock'
import ChartContainer from 'core/charts/ChartContainer'
import { useI18n } from 'core/i18n/i18nContext'
import { getToolDescription } from '../tools_helpers'
import ToolOpinionsChart from '../charts/ToolOpinionsChart'
import ToolOpinionsLegend from '../charts/ToolOpinionsLegend'

const ToolOpinionBlock = ({ block, data }) => {
    const blockData = data.data.aggregations.find(a => a.id === block.id)
    const resources = data.data.fields
        ? data.data.fields.resources.find(r => r.id === block.id)
        : { resources: {} }

    if (!blockData || !blockData.opinion) {
        return <div key={block.id}>No data available for tool: {block.id}</div>
    }

    const { translate } = useI18n()

    let githubName = resources.github && resources.github.name
    githubName = githubName && githubName.charAt(0).toUpperCase() + githubName.slice(1)

    return (
        <Block
            id={block.id}
            title={translate(`tool.${block.id}`)}
            showDescription={false}
        >
            <div className="Tool FTBlock">
                <div className="Tool__Chart FTBlock__Chart">
                    <ToolOpinionsLegend />
                    <ChartContainer height={40}>
                        <ToolOpinionsChart buckets={blockData.opinion.buckets} />
                    </ChartContainer>
                </div>
                <div className="Tool__Description FTBlock__Description">
                    <TextBlock text={getToolDescription(block, resources, translate)} />
                </div>
                {resources.github && (
                    <div className="Tool__Resources FTBlock__Resources">
                        <h3>{translate('block.tool.links')}</h3>
                        <ul>
                            <li className="FTBlock__Links__Item">
                                <a href={resources.github.url}>
                                    {translate('block.tool.github_link')}
                                </a>
                            </li>
                            <li className="FTBlock__Links__Item">
                                <a href={resources.github.homepage}>
                                    {translate('block.tool.homepage_link')}
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </Block>
    )
}

ToolOpinionBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
    }).isRequired,
    data: PropTypes.shape({
        data: PropTypes.shape({
            aggregations: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    opinion: PropTypes.shape({
                        total: PropTypes.number.isRequired,
                        buckets: PropTypes.arrayOf(
                            PropTypes.shape({
                                id: PropTypes.string.isRequired,
                                count: PropTypes.number.isRequired,
                                percentage: PropTypes.number.isRequired
                            })
                        ).isRequired
                    })
                })
            )
        }).isRequired
    }).isRequired
}

export default ToolOpinionBlock