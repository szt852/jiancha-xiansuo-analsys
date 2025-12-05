// 生成县市区排名表格
function generateDistrictRanking(data, containerId, isWarning = false) {
    // 将对象转换为数组并按值降序排序
    const sortedDistricts = Object.entries(data)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // 清空容器
    
    // 生成表格行
    sortedDistricts.forEach((district, index) => {
        const rank = index + 1;
        const isTopThree = rank <= 3;
        
        const row = document.createElement('tr');
        row.className = isTopThree ? 'font-bold bg-red-50' : 'hover:bg-gray-50';
        row.style.height = '36px'; // 减小表格行高
        
        // 添加排名图标样式
        const rankCell = document.createElement('td');
        rankCell.className = 'px-4 py-2 whitespace-nowrap'; // 减小padding
        
        if (isTopThree) {
            rankCell.innerHTML = `<div class="flex items-center">
                <div class="w-6 h-6 rounded-full ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-700'} flex items-center justify-center text-white text-xs mr-2">${rank}</div>
                <span class="text-red-600">${rank}</span>
            </div>`;
        } else {
            rankCell.textContent = rank;
        }
        
        const nameCell = document.createElement('td');
        nameCell.className = `px-4 py-2 whitespace-nowrap font-medium ${isTopThree ? 'text-red-600' : 'text-gray-800'}`; // 减小padding
        nameCell.textContent = district.name;
        
        const valueCell = document.createElement('td');
        valueCell.className = `px-4 py-2 whitespace-nowrap ${isTopThree ? 'text-red-600' : 'text-gray-700'}`; // 减小padding
        valueCell.innerHTML = `<span class="font-semibold">${district.value}</span>`;
        
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        container.appendChild(row);
    });
    
    return sortedDistricts;
}

// 渲染数据看板
function renderDashboard(data) {
    console.log('渲染数据看板:', data);
    
    // 首先显示数据看板本身
    document.getElementById('dashboard').style.display = 'block';
    
    // 显示基本情况文本
    const basicInfoElement = document.getElementById('basic-info');
    if (data.basic_info) {
        // 保留标题并添加内容
        const formattedText = data.basic_info.replace(/\n/g, '<br>');
        basicInfoElement.innerHTML = `<h5>基本情况概述：</h5>${formattedText}`;
    }
    
    // 显示主要指标
    document.getElementById('total-xiansuo').textContent = data.xiansuo_count;
    document.getElementById('jianshe-count').textContent = data.jianshe_project_count;
    document.getElementById('jianshe-count1').textContent = data.jianshe_project_count;
    document.getElementById('feijian-count').textContent = data.feijian_project_count;
    document.getElementById('feijian-count1').textContent = data.feijian_project_count;
    document.getElementById('warning-count').textContent = data.axzx_yvjing_count;
    
    // 显示详细信息
    document.getElementById('yirenduosu').textContent = data.yirenduosu;
    document.getElementById('duorenyisu').textContent = data.duorenyisu;
    document.getElementById('jianshe-renshu').textContent = data.jianshe_renshu + ' 人';
    document.getElementById('jianshe-jine').textContent = data.jianshe_jine + ' 万元';
    document.getElementById('feijian-renshu').textContent = data.feijian_renshu + ' 人';
    document.getElementById('feijian-jine').textContent = data.feijian_jine + ' 万元';
    
    // 生成县市区排名饼状图和柱状图
    const sortedDistricts = Object.entries(data.district_counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    renderDistrictPieChart(sortedDistricts, 'district-pie-chart');
    renderDistrictChart(sortedDistricts, 'district-chart', '#4BC0C0', '线索数量');
    
    // 构建建筑类县市区数据（如果不存在）
    if (!data.jianshe_district_counts) {
        data.jianshe_district_counts = {};
        // 为每个县市区初始化建筑类数据
        Object.keys(data.district_counts).forEach(district => {
            data.jianshe_district_counts[district] = 0;
        });
    }
    const sortedJiansheDistricts = Object.entries(data.jianshe_district_counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    renderDistrictPieChart(sortedJiansheDistricts, 'jianshe-district-pie-chart');
    renderDistrictChart(sortedJiansheDistricts, 'jianshe-district-chart', '#28a745', '线索数量');
    
    // 构建非建类县市区数据（如果不存在）
    if (!data.feijian_district_counts) {
        data.feijian_district_counts = {};
        // 为每个县市区初始化非建类数据
        Object.keys(data.district_counts).forEach(district => {
            data.feijian_district_counts[district] = 0;
        });
    }
    // 生成非建类县市区排名饼状图和柱状图
    const sortedFeijianDistricts = Object.entries(data.feijian_district_counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    renderDistrictPieChart(sortedFeijianDistricts, 'feijian-district-pie-chart');
    renderDistrictChart(sortedFeijianDistricts, 'feijian-district-chart', '#9966FF', '线索数量');
    
    // 构建预警县市区数据（如果不存在）
    if (!data.warning_district_counts) {
        data.warning_district_counts = {};
        // 为每个县市区初始化预警数据
        Object.keys(data.district_counts).forEach(district => {
            data.warning_district_counts[district] = 0;
        });
    }
    // 生成预警县市区排名饼状图和柱状图
    const sortedWarningDistricts = Object.entries(data.warning_district_counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    renderDistrictPieChart(sortedWarningDistricts, 'warning-district-pie-chart');
    renderDistrictChart(sortedWarningDistricts, 'warning-district-chart', '#FF6384', '预警数量');
    
    // 渲染预警类统计数据卡片
    document.getElementById('warning-case-total').textContent = data.warning_case_total || 0;
    document.getElementById('unique-construction-units').textContent = data.unique_construction_units || 0;
    document.getElementById('unique-projects').textContent = data.unique_projects || 0;
    
    // 渲染预警类所涉行业饼图
    if (data.warning_industry_counts) {
        const warningIndustryData = Object.entries(data.warning_industry_counts)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const warningIndustryContainer = document.getElementById('warning-industry-chart');
        if (warningIndustryContainer) {
            warningIndustryContainer.style.height = '350px';
            warningIndustryContainer.style.width = '100%';
            warningIndustryContainer.style.top = '-30px';

            
            let warningIndustryChart;
            try {
                warningIndustryChart = echarts.init(warningIndustryContainer);
                
                const option = {
                    // title: {
                    //     text: '预警行业',
                    //     left: 'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        data: warningIndustryData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '行业',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: warningIndustryData
                        }
                    ]
                };
                
                warningIndustryChart.setOption(option);
                
                // 添加窗口大小变化事件监听
                window.addEventListener('resize', function() {
                    warningIndustryChart.resize();
                });
            } catch (error) {
                console.error('渲染预警类所涉行业饼图失败:', error);
            }
        }
    }
    
    // 渲染预警类型饼图
    if (data.warning_types) {
        const warningTypeData = Object.entries(data.warning_types)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const warningTypeContainer = document.getElementById('warning-type-chart');
        if (warningTypeContainer) {
            warningTypeContainer.style.height = '350px';
            warningTypeContainer.style.width = '100%';
            warningTypeContainer.style.top = '-30px';
            
            let warningTypeChart;
            try {
                warningTypeChart = echarts.init(warningTypeContainer);
                
                const option = {
                    // title: {
                    //     text: '预警类型',
                    //     left: 'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        data: warningTypeData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '预警类型',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: warningTypeData
                        }
                    ]
                };
                
                warningTypeChart.setOption(option);
                
                // 添加窗口大小变化事件监听
                window.addEventListener('resize', function() {
                    warningTypeChart.resize();
                });
            } catch (error) {
                console.error('渲染预警类型饼图失败:', error);
            }
        }
    }
    
    // 渲染预警状态饼图
    if (data.warning_status_counts) {
        const warningStatusData = Object.entries(data.warning_status_counts)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const warningStatusContainer = document.getElementById('warning-status-chart');
        if (warningStatusContainer) {
            warningStatusContainer.style.height = '350px';
            warningStatusContainer.style.width = '100%';
            warningStatusContainer.style.top = '-30px';
            
            let warningStatusChart;
            try {
                warningStatusChart = echarts.init(warningStatusContainer);
                
                const option = {
                    // title: {
                    //     text: '预警状态',
                    //     left: 'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        data: warningStatusData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '预警状态',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: warningStatusData
                        }
                    ]
                };
                
                warningStatusChart.setOption(option);
                
                // 添加窗口大小变化事件监听
                window.addEventListener('resize', function() {
                    warningStatusChart.resize();
                });
            } catch (error) {
                console.error('渲染预警状态饼图失败:', error);
            }
        }
    }
    
    // 渲染建筑类其他维度分析图表
    
    // 1. 建筑类事件来源饼图
    if (data.jianshe_event_source_counts) {
        const jiansheEventSourceData = Object.entries(data.jianshe_event_source_counts)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const jiansheEventSourceContainer = document.getElementById('jianshe-event-source-chart');
        if (jiansheEventSourceContainer) {
            jiansheEventSourceContainer.style.height = '350px';
            jiansheEventSourceContainer.style.width = '100%';
            jiansheEventSourceContainer.style.top = '-30px';
            
            let jiansheEventSourceChart;
            try {
                jiansheEventSourceChart = echarts.init(jiansheEventSourceContainer);
                
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `<div style="padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px;">${params.seriesName}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: ${params.color};">● ${params.name}:</span>
                                    <span style="font-weight: bold;">${params.value} 条 (${params.percent}%)</span>
                                </div>
                            </div>`;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        textStyle: {
                            color: '#333',
                            fontSize: 14
                        },
                        padding: 10,
                        borderRadius: 6
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: function(name) {
                            return name.length > 8 ? name.substring(0, 8) + '...' : name;
                        },
                        data: jiansheEventSourceData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '事件来源',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    formatter: function(params) {
                                        const shortName = params.name.length > 10 ? params.name.substring(0, 10) + '...' : params.name;
                                        return `${shortName}\n${params.value} 条 (${params.percent}%)`;
                                    }
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: jiansheEventSourceData,
                            color: [
                                '#28a745', '#62C462', '#8AD98A', '#BCE5BD',
                                '#E6F5E6', '#F0FFF0', '#C3E6CB', '#74C476'
                            ]
                        }
                    ],
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                };
                
                jiansheEventSourceChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (jiansheEventSourceChart) {
                        jiansheEventSourceChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染建筑类事件来源饼图失败:', error);
            }
        }
    }
    
    // 2. 建筑类行业分布饼图
    if (data.jianshe_industry_counts) {
        const jiansheIndustryData = Object.entries(data.jianshe_industry_counts)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const jiansheIndustryContainer = document.getElementById('jianshe-industry-chart');
        if (jiansheIndustryContainer) {
            jiansheIndustryContainer.style.height = '350px';
            jiansheIndustryContainer.style.width = '100%';
            jiansheIndustryContainer.style.top = '-30px';
            
            let jiansheIndustryChart;
            try {
                jiansheIndustryChart = echarts.init(jiansheIndustryContainer);
                
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `<div style="padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px;">${params.seriesName}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: ${params.color};">● ${params.name}:</span>
                                    <span style="font-weight: bold;">${params.value} 条 (${params.percent}%)</span>
                                </div>
                            </div>`;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        textStyle: {
                            color: '#333',
                            fontSize: 14
                        },
                        padding: 10,
                        borderRadius: 6
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: function(name) {
                            return name.length > 8 ? name.substring(0, 8) + '...' : name;
                        },
                        data: jiansheIndustryData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '所涉行业',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    formatter: function(params) {
                                        const shortName = params.name.length > 10 ? params.name.substring(0, 10) + '...' : params.name;
                                        return `${shortName}\n${params.value} 条 (${params.percent}%)`;
                                    }
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: jiansheIndustryData,
                            color: [
                                '#17A2B8', '#66B3FF', '#99CCFF', '#CCE5FF',
                                '#E6F2FF', '#F0F8FF', '#90CAF9', '#42A5F5'
                            ]
                        }
                    ],
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                };
                
                jiansheIndustryChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (jiansheIndustryChart) {
                        jiansheIndustryChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染建筑类行业分布饼图失败:', error);
            }
        }
    }
    
    // 3. 建筑类项目性质饼图
    if (data.jianshe_project_nature_counts) {
        const jiansheProjectNatureData = Object.entries(data.jianshe_project_nature_counts)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const jiansheProjectNatureContainer = document.getElementById('jianshe-project-nature-chart');
        if (jiansheProjectNatureContainer) {
            jiansheProjectNatureContainer.style.height = '350px';
            jiansheProjectNatureContainer.style.width = '100%';
            jiansheProjectNatureContainer.style.top = '-30px';
            
            let jiansheProjectNatureChart;
            try {
                jiansheProjectNatureChart = echarts.init(jiansheProjectNatureContainer);
                
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `<div style="padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px;">${params.seriesName}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: ${params.color};">● ${params.name}:</span>
                                    <span style="font-weight: bold;">${params.value} 条 (${params.percent}%)</span>
                                </div>
                            </div>`;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        textStyle: {
                            color: '#333',
                            fontSize: 14
                        },
                        padding: 10,
                        borderRadius: 6
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: function(name) {
                            return name.length > 8 ? name.substring(0, 8) + '...' : name;
                        },
                        data: jiansheProjectNatureData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '项目性质',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    formatter: function(params) {
                                        const shortName = params.name.length > 10 ? params.name.substring(0, 10) + '...' : params.name;
                                        return `${shortName}\n${params.value} 条 (${params.percent}%)`;
                                    }
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: jiansheProjectNatureData,
                            color: [
                                '#FFC107', '#FFD700', '#FFE066', '#FFE899',
                                '#FFF0CC', '#FFF8E1', '#FFECB3', '#FFD54F'
                            ]
                        }
                    ],
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                };
                
                jiansheProjectNatureChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (jiansheProjectNatureChart) {
                        jiansheProjectNatureChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染建筑类项目性质饼图失败:', error);
            }
        }
    }
    
    // 4. 建筑类人数金额散点图
    if (data.jianshe_scatter_data && data.jianshe_scatter_data.length > 0) {
        const jiansheScatterContainer = document.getElementById('jianshe-scatter-chart');
        if (jiansheScatterContainer) {
            jiansheScatterContainer.style.height = '400px';
            jiansheScatterContainer.style.width = '100%';
            
            let jiansheScatterChart;
            try {
                jiansheScatterChart = echarts.init(jiansheScatterContainer);
                
                const scatterData = data.jianshe_scatter_data.map(item => [item.id, item.people, item.amount]);
                
                const option = {
                    title: {
                        text: '涉及人数与金额分布',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `序号: ${params.value[0]}<br/>人数: ${params.value[1]}<br/>金额: ${params.value[2]}元`;
                        }
                    },
                    legend: {
                        data: ['数据点', '人数平均线', '金额平均线'],
                        top: 30
                    },
                    xAxis: {
                        type: 'value',
                        name: '序号',
                        nameLocation: 'middle',
                        nameGap: 30
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '人数',
                            nameLocation: 'middle',
                            nameGap: 50,
                            position: 'left'
                        },
                        {
                            type: 'value',
                            name: '金额(元)',
                            nameLocation: 'middle',
                            nameGap: 50,
                            position: 'right'
                        }
                    ],
                    series: [
                        {
                            name: '数据点',
                            type: 'scatter',
                            symbolSize: function(data) {
                                return Math.sqrt(data[1] + data[2] / 1000);
                            },
                            data: scatterData,
                            itemStyle: {
                                color: '#28a745'
                            }
                        },
                        {
                            name: '人数平均线',
                            type: 'line',
                            data: [[scatterData[0][0], data.jianshe_people_avg], [scatterData[scatterData.length-1][0], data.jianshe_people_avg]],
                            lineStyle: {
                                color: '#dc3545',
                                type: 'dashed'
                            },
                            symbol: 'none'
                        },
                        {
                            name: '金额平均线',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [[scatterData[0][0], data.jianshe_amount_avg], [scatterData[scatterData.length-1][0], data.jianshe_amount_avg]],
                            lineStyle: {
                                color: '#007bff',
                                type: 'dashed'
                            },
                            symbol: 'none'
                        }
                    ]
                };
                
                jiansheScatterChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (jiansheScatterChart) {
                        jiansheScatterChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染建筑类人数金额散点图失败:', error);
            }
        }
    }
    
    // 渲染非建类其他维度分析图表
    
    // 1. 非建类事件来源饼图
    if (data.feijian_event_source_counts) {
        const feijianEventSourceData = Object.entries(data.feijian_event_source_counts)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const feijianEventSourceContainer = document.getElementById('feijian-event-source-chart');
        if (feijianEventSourceContainer) {
            feijianEventSourceContainer.style.height = '350px';
            feijianEventSourceContainer.style.width = '100%';
            feijianEventSourceContainer.style.top = '-30px';
            
            let feijianEventSourceChart;
            try {
                feijianEventSourceChart = echarts.init(feijianEventSourceContainer);
                
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `<div style="padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px;">${params.seriesName}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: ${params.color};">● ${params.name}:</span>
                                    <span style="font-weight: bold;">${params.value} 条 (${params.percent}%)</span>
                                </div>
                            </div>`;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        textStyle: {
                            color: '#333',
                            fontSize: 14
                        },
                        padding: 10,
                        borderRadius: 6
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: function(name) {
                            return name.length > 8 ? name.substring(0, 8) + '...' : name;
                        },
                        data: feijianEventSourceData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '事件来源',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    formatter: function(params) {
                                        const shortName = params.name.length > 10 ? params.name.substring(0, 10) + '...' : params.name;
                                        return `${shortName}\n${params.value} 条 (${params.percent}%)`;
                                    }
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: feijianEventSourceData,
                            color: [
                                '#9966FF', '#C2B8FF', '#A569BD', '#8E44AD', 
                                '#BB8FCE', '#D2B4DE', '#E8DAEF', '#F5EEF8'
                            ]
                        }
                    ],
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                };
                
                feijianEventSourceChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (feijianEventSourceChart) {
                        feijianEventSourceChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染非建类事件来源饼图失败:', error);
            }
        }
    }
    
    // 2. 非建类行业分布饼图
    if (data.feijian_industry_data || data.feijian_industry_counts) {
        // 优先使用feijian_industry_counts，如果不存在则使用feijian_industry_data
        const industryData = data.feijian_industry_counts || data.feijian_industry_data;
        const feijianIndustryData = Object.entries(industryData)
            .map(([name, value]) => ({value: value || 0, name: name}))
            .sort((a, b) => b.value - a.value);
        
        const feijianIndustryContainer = document.getElementById('feijian-industry-chart');
        if (feijianIndustryContainer) {
            feijianIndustryContainer.style.height = '350px';
            feijianIndustryContainer.style.width = '100%';
            feijianIndustryContainer.style.top = '-30px';
            
            let feijianIndustryChart;
            try {
                feijianIndustryChart = echarts.init(feijianIndustryContainer);
                
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `<div style="padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px;">${params.seriesName}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: ${params.color};">● ${params.name}:</span>
                                    <span style="font-weight: bold;">${params.value} 条 (${params.percent}%)</span>
                                </div>
                            </div>`;
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        textStyle: {
                            color: '#333',
                            fontSize: 14
                        },
                        padding: 10,
                        borderRadius: 6
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 10,
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: function(name) {
                            return name.length > 8 ? name.substring(0, 8) + '...' : name;
                        },
                        data: feijianIndustryData.map(item => item.name)
                    },
                    series: [
                        {
                            name: '所涉行业',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    formatter: function(params) {
                                        const shortName = params.name.length > 10 ? params.name.substring(0, 10) + '...' : params.name;
                                        return `${shortName}\n${params.value} 条 (${params.percent}%)`;
                                    }
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: feijianIndustryData,
                            color: [
                                '#FF6384', '#FF85A1', '#FFA8BD', '#FFCBDB',
                                '#FFE8F0', '#FFF5F5', '#FFC6D3', '#FF85B3'
                            ]
                        }
                    ],
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                };
                
                feijianIndustryChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (feijianIndustryChart) {
                        feijianIndustryChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染非建类行业分布饼图失败:', error);
            }
        }
    }
    
    // 3. 非建类人数金额散点图
    if (data.feijian_scatter_data && data.feijian_scatter_data.length > 0) {
        const feijianScatterContainer = document.getElementById('feijian-scatter-chart');
        if (feijianScatterContainer) {
            feijianScatterContainer.style.height = '400px';
            feijianScatterContainer.style.width = '100%';
            
            let feijianScatterChart;
            try {
                feijianScatterChart = echarts.init(feijianScatterContainer);
                
                const scatterData = data.feijian_scatter_data.map(item => [item.id, item.people, item.amount]);
                
                const option = {
                    title: {
                        text: '涉及人数与金额分布',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return `序号: ${params.value[0]}<br/>人数: ${params.value[1]}<br/>金额: ${params.value[2]}元`;
                        }
                    },
                    legend: {
                        data: ['数据点', '人数平均线', '金额平均线'],
                        top: 30
                    },
                    xAxis: {
                        type: 'value',
                        name: '序号',
                        nameLocation: 'middle',
                        nameGap: 30
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '人数',
                            nameLocation: 'middle',
                            nameGap: 50,
                            position: 'left'
                        },
                        {
                            type: 'value',
                            name: '金额(元)',
                            nameLocation: 'middle',
                            nameGap: 50,
                            position: 'right'
                        }
                    ],
                    series: [
                        {
                            name: '数据点',
                            type: 'scatter',
                            symbolSize: function(data) {
                                return Math.sqrt(data[1] + data[2] / 1000);
                            },
                            data: scatterData,
                            itemStyle: {
                                color: '#9966FF'
                            }
                        },
                        {
                            name: '人数平均线',
                            type: 'line',
                            data: [[scatterData[0][0], data.feijian_people_avg], [scatterData[scatterData.length-1][0], data.feijian_people_avg]],
                            lineStyle: {
                                color: '#dc3545',
                                type: 'dashed'
                            },
                            symbol: 'none'
                        },
                        {
                            name: '金额平均线',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [[scatterData[0][0], data.feijian_amount_avg], [scatterData[scatterData.length-1][0], data.feijian_amount_avg]],
                            lineStyle: {
                                color: '#007bff',
                                type: 'dashed'
                            },
                            symbol: 'none'
                        }
                    ]
                };
                
                feijianScatterChart.setOption(option);
                window.addEventListener('resize', function() {
                    if (feijianScatterChart) {
                        feijianScatterChart.resize();
                    }
                });
            } catch (error) {
                console.error('渲染非建类人数金额散点图失败:', error);
            }
        }
    }
    
    // 渲染图表 - 使用ECharts
    // 1. 来源分布饼图
    // 添加调试信息
    console.log('渲染线索来源分布饼图，数据:', data.event_source_counts);
    
    // 确保容器存在
    const sourceChartContainer = document.getElementById('source-chart');
    if (sourceChartContainer) {
        console.log('找到容器，初始化图表...');
        
        // 强制设置容器高度，确保图表有足够空间显示
        sourceChartContainer.style.height = '400px';
        sourceChartContainer.style.width = '100%';
        sourceChartContainer.style.display = 'block';
        
        // 创建图表实例
        let sourceChart;
        try {
            sourceChart = echarts.init(sourceChartContainer);
            console.log('图表初始化成功');
        } catch (error) {
            console.error('图表初始化失败:', error);
        }
        
        // 处理事件来源数据
        let sourceData = [];
        if (data.event_source_counts) {
            // 将对象转换为数组并按数量降序排序
            sourceData = Object.entries(data.event_source_counts)
                .map(([name, value]) => ({value: value || 0, name: name}))
                .sort((a, b) => b.value - a.value);
        }
        
        console.log('图表数据:', sourceData);
        
        // 填充左侧表格
        fillSourceTable(sourceData);
        
        // 为来源分布饼图设置多种颜色
        const sourceColors = [
            '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#C9CBCF', '#F9F9F9'
        ];
        
        // 设置图表选项
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    // 自定义tooltip，显示具体数值和百分比
                    return `<div style="padding: 8px;">
                        <div style="font-weight: bold; margin-bottom: 4px;">${params.seriesName}</div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: ${params.color};">● ${params.name}:</span>
                            <span style="font-weight: bold;">${params.value} 条 (${params.percent}%)</span>
                        </div>
                    </div>`;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 14
                },
                padding: 10,
                borderRadius: 6
            },
            legend: {
                orient: 'horizontal',
                bottom: 20,
                left: 'center',
                data: sourceData.map(item => item.name),
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontWeight: '500'
                },
                itemWidth: 20,
                itemHeight: 14,
                itemGap: 20,
                formatter: function(name) {
                    // 限制legend文本长度，过长显示省略号
                    return name.length > 10 ? name.substring(0, 10) + '...' : name;
                }
            },
            series: [
                {
                    name: '线索来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '45%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2,
                        color: function(params) {
                            return sourceColors[params.dataIndex % sourceColors.length];
                        },
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            formatter: function(params) {
                                // 格式化显示，避免文本过长
                                const name = params.name.length > 15 ? params.name.substring(0, 15) + '...' : params.name;
                                return name + '\n' + params.value + ' 条\n' + params.percent + '%';
                            },
                            textStyle: {
                                color: '#333'
                            }
                        },
                        itemStyle: {
                            shadowBlur: 20,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: 10
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    // 添加动画效果
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    },
                    data: sourceData
                }
            ]
        };
        
        // 应用图表选项
        if (sourceChart) {
            sourceChart.setOption(option);
            console.log('图表选项设置成功');
            
            // 强制重新渲染
            sourceChart.resize();
            
            // 保存图表实例到全局，以便调整大小
window.sourceChart = sourceChart;
                    
// 添加窗口大小变化事件监听器，确保图表在窗口大小变化时能够正确重绘
window.addEventListener('resize', function() {
    try {
        if (window.sourceChart) {
            window.sourceChart.resize();
            console.log('图表已重绘');
        }
    } catch (error) {
        console.error('图表重绘失败:', error);
    }
});
        }
    } else {
        console.error('未找到容器元素: source-chart');
    }

    // 填充来源统计表格
    function fillSourceTable(data) {
        const tableBody = document.getElementById('source-table-body');
        const totalElement = document.getElementById('source-total');
        
        if (tableBody && totalElement) {
            // 清空表格
            tableBody.innerHTML = '';
            
            // 计算总数
            let total = 0;
            
            // 填充数据行
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                
                // 限制来源名称长度，过长显示省略号
                const displayName = item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name;
                
                row.innerHTML = `
                    <td class="py-2 px-3 text-gray-700" title="${item.name}">${displayName}</td>
                    <td class="text-right py-2 px-3 font-medium text-gray-800">${item.value}</td>
                `;
                
                tableBody.appendChild(row);
                total += item.value;
            });
            
            // 更新总数
            totalElement.textContent = total;
        }
    }
    
    // 2. 建设领域行业分布环形图
    const jiansheIndustryChart = echarts.init(document.getElementById('jianshe-industry-chart'));
    const jiansheLabels = Object.keys(data.industry_counts);
    const jiansheValues = Object.values(data.industry_counts);
    const jiansheColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    jiansheIndustryChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 10,
            left: 'center',
            data: jiansheLabels
        },
        series: [
            {
                name: '行业分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                    color: function(params) {
                        return jiansheColors[params.dataIndex % jiansheColors.length];
                    }
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: jiansheLabels.map((label, index) => ({
                    value: jiansheValues[index],
                    name: label
                }))
            }
        ]
    });
    
    // 3. 非建领域行业分布环形图
    const feijianIndustryChart = echarts.init(document.getElementById('feijian-industry-chart'));
    const feijianLabels = Object.keys(data.feijian_industry_counts);
    const feijianValues = Object.values(data.feijian_industry_counts);
    const feijianColors = ['#FF9F40', '#C7C7C7', '#5366FF', '#FF6384', '#36A2EB'];
    
    feijianIndustryChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 10,
            left: 'center',
            data: feijianLabels
        },
        series: [
            {
                name: '行业分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                    color: function(params) {
                        return feijianColors[params.dataIndex % feijianColors.length];
                    }
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: feijianLabels.map((label, index) => ({
                    value: feijianValues[index],
                    name: label
                }))
            }
        ]
    });
    
    // 添加窗口大小改变时重新调整图表
    window.addEventListener('resize', function() {
        sourceChart.resize();
        jiansheIndustryChart.resize();
        feijianIndustryChart.resize();
        // 调整县市区排名图表
        if (window.districtChart) window.districtChart.resize();
        if (window.districtPieChart) window.districtPieChart.resize();
        if (window.jiansheDistrictChart) window.jiansheDistrictChart.resize();
        if (window.jiansheDistrictPieChart) window.jiansheDistrictPieChart.resize();
        if (window.feijianDistrictChart) window.feijianDistrictChart.resize();
        if (window.feijianDistrictPieChart) window.feijianDistrictPieChart.resize();
        if (window.warningDistrictChart) window.warningDistrictChart.resize();
        if (window.warningDistrictPieChart) window.warningDistrictPieChart.resize();
    });
    

    

    
    // 渲染建筑类涉及人数较多的项目表格
    renderLargeProjectsTable('jianshe-large-projects-table', data.jianshe_large_projects || []);
    
    // 渲染非建类涉及人数较多的项目表格
    renderLargeProjectsTable('feijian-large-projects-table', data.feijian_large_projects || []);
    
    // 初始化表格排序功能
    initTableSorting();
    
    // 初始化模态框事件监听
    initModalEvents();
    
    // 显示数据看板内容，隐藏加载提示 - 添加存在性检查
    const loadingElement = document.getElementById('dashboard-loading');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
    
    const contentElement = document.getElementById('dashboard-content');
    if (contentElement) {
        contentElement.classList.remove('hidden');
    }
    
    // 滚动到数据看板 - 添加存在性检查
    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 渲染涉及人数较多的项目表格
    function renderLargeProjectsTable(tableId, projectsData) {
        const tableBody = document.getElementById(tableId);
        if (!tableBody) return;
        
        // 获取表格容器
        const tableContainer = tableBody.closest('.table-responsive');
        
        // 保存原始数据
        if (!tableContainer.dataset.projectsData) {
            tableContainer.dataset.projectsData = JSON.stringify(projectsData);
        }
        
        // 初始化分页状态
        if (!tableContainer.dataset.currentPage) {
            tableContainer.dataset.currentPage = '1';
        }
        
        if (!tableContainer.dataset.sortField) {
            tableContainer.dataset.sortField = '';
            tableContainer.dataset.sortOrder = 'asc';
        }
        
        // 每页显示的行数
        const pageSize = 10;
        const currentPage = parseInt(tableContainer.dataset.currentPage);
        
        // 排序逻辑
        let sortedData = [...projectsData];
        const sortField = tableContainer.dataset.sortField;
        const sortOrder = tableContainer.dataset.sortOrder;
        
        if (sortField) {
            sortedData.sort((a, b) => {
                let aVal = a[sortField] || '';
                let bVal = b[sortField] || '';
                
                // 数值比较
                if (sortField === 'people_count' || sortField === 'amount') {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                // 字符串比较
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });
        }
        
        // 分页逻辑
        const totalPages = Math.ceil(sortedData.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = sortedData.slice(startIndex, endIndex);
        
        // 清空表格
        tableBody.innerHTML = '';
        
        if (paginatedData.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 7; // 增加列数，因为新增了诉求人列
            emptyCell.className = 'align-middle';
            emptyCell.style.textAlign = 'center';
            emptyCell.textContent = '暂无数据';
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
        } else {
            // 填充表格数据
            paginatedData.forEach(project => {
                const row = document.createElement('tr');
                
                // 创建文本单元格（左对齐）
                const createTextCell = (content, width) => {
                    const cell = document.createElement('td');
                    cell.className = 'align-middle';
                    cell.style.textAlign = 'left';
                    if (width) {
                        cell.style.width = width;
                        cell.style.overflow = 'hidden';
                        cell.style.textOverflow = 'ellipsis';
                        cell.style.whiteSpace = 'nowrap';
                        cell.style.wordBreak = 'keep-all';
                    }
                    cell.textContent = content || '--';
                    return cell;
                };
                
                // 创建数值单元格（左对齐）
                const createNumberCell = (content) => {
                    const cell = document.createElement('td');
                    cell.className = 'align-middle';
                    cell.style.textAlign = 'left';
                    cell.textContent = content || '--';
                    return cell;
                };
                
                // 创建按钮单元格（居中对齐）
                const createButtonCell = (content) => {
                    const cell = document.createElement('td');
                    cell.className = 'align-middle';
                    cell.style.textAlign = 'center';
                    const viewButton = document.createElement('button');
                    viewButton.className = 'btn btn-primary btn-sm';
                    viewButton.textContent = '查看';
                    viewButton.dataset.content = content || '--';
                    cell.appendChild(viewButton);
                    return cell;
                };
                
                // 添加单元格
                row.appendChild(createTextCell(project.project_name, '300px')); // 调整宽度，为诉求人列腾出空间
                row.appendChild(createTextCell(project.district));
                row.appendChild(createTextCell(project.industry));
                row.appendChild(createNumberCell(project.people_count));
                row.appendChild(createNumberCell(project.amount ? (project.amount.toFixed(2) + '元') : '--'));
                row.appendChild(createTextCell(project.applicant, '150px')); // 添加诉求人列，设置宽度
                row.appendChild(createButtonCell(project.content));
                
                // 添加行到表格
                tableBody.appendChild(row);
            });
        }
        
        // 渲染分页控件
        renderPaginationControls(tableContainer, currentPage, totalPages, tableId);
    }
    
    // 渲染分页控件
    function renderPaginationControls(tableContainer, currentPage, totalPages, tableId) {
        // 移除旧的分页控件
        const oldPagination = tableContainer.nextElementSibling;
        if (oldPagination && oldPagination.classList.contains('pagination-container')) {
            oldPagination.remove();
        }
        
        // 创建分页控件容器
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container d-flex justify-content-between align-items-center mt-3';
        
        // 添加分页信息
        const pageInfo = document.createElement('div');
        pageInfo.className = 'text-sm text-gray-600';
        pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
        paginationContainer.appendChild(pageInfo);
        
        // 创建分页按钮组
        const pagination = document.createElement('nav');
        const paginationList = document.createElement('ul');
        paginationList.className = 'pagination';
        
        // 上一页按钮
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        const prevButton = document.createElement('button');
        prevButton.className = 'page-link';
        prevButton.textContent = '上一页';
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                tableContainer.dataset.currentPage = (currentPage - 1).toString();
                const projectsData = JSON.parse(tableContainer.dataset.projectsData);
                renderLargeProjectsTable(tableId, projectsData);
            }
        });
        prevLi.appendChild(prevButton);
        paginationList.appendChild(prevLi);
        
        // 页码按钮（简化版，只显示前后几页）
        const pageRange = 2;
        let startPage = Math.max(1, currentPage - pageRange);
        let endPage = Math.min(totalPages, currentPage + pageRange);
        
        // 确保至少显示5个页码
        if (endPage - startPage < 4 && totalPages > 5) {
            if (startPage === 1) {
                endPage = 5;
            } else if (endPage === totalPages) {
                startPage = totalPages - 4;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
            const pageButton = document.createElement('button');
            pageButton.className = 'page-link';
            pageButton.textContent = i;
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                tableContainer.dataset.currentPage = i.toString();
                const projectsData = JSON.parse(tableContainer.dataset.projectsData);
                renderLargeProjectsTable(tableId, projectsData);
            });
            pageLi.appendChild(pageButton);
            paginationList.appendChild(pageLi);
        }
        
        // 下一页按钮
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        const nextButton = document.createElement('button');
        nextButton.className = 'page-link';
        nextButton.textContent = '下一页';
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                tableContainer.dataset.currentPage = (currentPage + 1).toString();
                const projectsData = JSON.parse(tableContainer.dataset.projectsData);
                renderLargeProjectsTable(tableId, projectsData);
            }
        });
        nextLi.appendChild(nextButton);
        paginationList.appendChild(nextLi);
        
        pagination.appendChild(paginationList);
        paginationContainer.appendChild(pagination);
        
        // 插入到表格容器之后
        tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
    }
    
    // 初始化表格排序功能
    function initTableSorting() {
        // 为表头添加排序功能
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const thead = table.querySelector('thead');
            if (thead) {
                const thElements = thead.querySelectorAll('th');
                thElements.forEach((th, index) => {
                    // 确定对应的字段名
                    let fieldName = '';
                    switch (index) {
                        case 0: fieldName = 'project_name'; break; // 所涉项目（企业）
                        case 1: fieldName = 'district'; break; // 所属区域
                        case 2: fieldName = 'industry'; break; // 所涉行业
                        case 3: fieldName = 'people_count'; break; // 涉及人数
                        case 4: fieldName = 'amount'; break; // 涉及金额
                        case 5: fieldName = 'content'; break; // 诉求内容
                    }
                    
                    if (fieldName) {
                        // 添加排序点击事件
                        th.style.cursor = 'pointer';
                        th.style.userSelect = 'none';
                        
                        // 添加排序点击事件
                        th.addEventListener('click', () => {
                            const tableContainer = table.closest('.table-responsive');
                            if (!tableContainer) return;
                            
                            // 切换排序方向
                            const currentField = tableContainer.dataset.sortField;
                            const currentOrder = tableContainer.dataset.sortOrder;
                            
                            if (currentField === fieldName) {
                                // 同一字段再次点击，切换排序方向
                                tableContainer.dataset.sortOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                            } else {
                                // 不同字段，重置为升序
                                tableContainer.dataset.sortField = fieldName;
                                tableContainer.dataset.sortOrder = 'asc';
                            }
                            
                            // 更新排序图标
                            updateSortIcons(thead, index, tableContainer.dataset.sortOrder);
                            
                            // 重新渲染表格
                            const tableId = table.querySelector('tbody').id;
                            const projectsData = JSON.parse(tableContainer.dataset.projectsData);
                            tableContainer.dataset.currentPage = '1'; // 重置到第一页
                            renderLargeProjectsTable(tableId, projectsData);
                        });
                    }
                });
            }
        });
    }
    
    // 更新排序图标
    function updateSortIcons(thead, activeIndex, sortOrder) {
        const thElements = thead.querySelectorAll('th');
        thElements.forEach((th, index) => {
            // 移除所有排序图标
            const iconSpan = th.querySelector('.sort-icon');
            if (iconSpan) {
                th.removeChild(iconSpan);
            }
            
            // 为当前活跃的排序字段添加图标
            if (index === activeIndex) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'sort-icon ml-1';
                iconSpan.textContent = sortOrder === 'asc' ? '↑' : '↓';
                th.appendChild(iconSpan);
            }
        });
    }
    
    // 初始化模态框事件
    function initModalEvents() {
        // 使用事件委托处理所有查看按钮的点击事件
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-primary') && e.target.textContent === '查看') {
                // 获取项目诉求内容
                const button = e.target;
                const content = button.dataset.content || '暂无内容';
                
                // 设置模态框内容
                showContentModal(content);
            }
        });
        
        // 关闭按钮点击事件
        document.querySelector('#close-modal')?.addEventListener('click', function() {
            hideContentModal();
        });
        
        // 点击模态框外部关闭
        document.querySelector('#content-modal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                hideContentModal();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideContentModal();
            }
        });
    }
    
    // 显示诉求内容模态框
    function showContentModal(content) {
        const modal = document.getElementById('content-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (!modal || !modalContent) return;
        
        // 设置模态框内容，只显示诉求内容
        modalContent.textContent = content;
        
        // 显示模态框
        modal.style.display = 'flex';
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 隐藏诉求内容模态框
    function hideContentModal() {
        const modal = document.getElementById('content-modal');
        if (modal) {
            modal.style.display = 'none';
            // 恢复背景滚动
            document.body.style.overflow = 'auto';
        }
    }
}

// 渲染县市区排名柱状图
function renderDistrictChart(data, containerId, color, label) {
    // 检查容器是否存在
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`容器元素不存在: ${containerId}`);
        return null;
    }
    
    // 固定的县市区顺序
    const fixedDistricts = [
        '宜都市', '枝江市', '当阳市', '远安县', '兴山县', 
        '秭归县', '长阳县', '五峰县', '夷陵区', '西陵区', 
        '伍家岗区', '点军区', '猇亭区', '高新区'
    ];
    
    // 将数据转换为对象，方便查找
    const dataMap = {};
    data.forEach(item => {
        dataMap[item.name] = item.value;
    });
    
    // 按照固定顺序构建数据，确保所有县市区都显示，数据为0的也显示
    const displayData = fixedDistricts.map(name => ({
        name: name,
        value: dataMap[name] || 0
    }));
    
    // 找出最大值
    const maxValue = Math.max(...displayData.map(item => item.value));
    
    // 强制设置容器尺寸
    container.style.width = '100%';
    container.style.height = '400px';
    
    let chart;
    try {
        chart = echarts.init(container);
    } catch (error) {
        console.error(`图表初始化失败 (${containerId}):`, error);
        return null;
    }
    
    // 保存图表实例到全局，以便调整大小
    window[containerId] = chart;
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return params[0].name + ': ' + params[0].value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%', // 增加底部边距，避免文字重叠
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: displayData.map(item => item.name),
            axisLabel: {
                interval: 0,
                rotate: 45, // 增加旋转角度，避免文字重叠
                fontSize: 10, // 减小字体大小
                height: 80 // 增加高度，容纳旋转的文字
            }
        },
        yAxis: {
            type: 'value',
            // name: label,
            nameLocation: 'middle',
            nameGap: 40
        },
        series: [{
            data: displayData.map((item) => {
                // 只将数量最多的地区标红，其他为蓝色
                const isMax = item.value === maxValue;
                
                return {
                    value: item.value,
                    itemStyle: {
                        color: isMax ? '#dc3545' : '#36A2EB' // 红色表示最多，蓝色表示其他
                    }
                };
            }),
            type: 'bar',
            barWidth: '50%', // 减小柱宽，避免拥挤
            label: {
                show: true,
                position: 'top',
                fontSize: 10, // 减小字体大小
                fontWeight: 'bold',
                color: function(params) {
                    // 只将数量最多的地区标签标红
                    return params.value === maxValue ? '#dc3545' : '#333';
                }
            },
            // 移除渐变效果，使用纯色
            itemStyle: {
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };
    
    chart.setOption(option);
    return chart;
}

// 渲染县市区排名饼状图
function renderDistrictPieChart(data, containerId, title) {
    // 检查容器是否存在
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`容器元素不存在: ${containerId}`);
        return null;
    }
    
    // 固定的县市区顺序
    const fixedDistricts = [
        '宜都市', '枝江市', '当阳市', '远安县', '兴山县', 
        '秭归县', '长阳县', '五峰县', '夷陵区', '西陵区', 
        '伍家岗区', '点军区', '猇亭区', '高新区'
    ];
    
    // 将数据转换为对象，方便查找
    const dataMap = {};
    data.forEach(item => {
        dataMap[item.name] = item.value;
    });
    
    // 按照固定顺序构建数据，确保所有县市区都显示，数据为0的也显示
    const pieData = fixedDistricts.map(name => ({
        name: name,
        value: dataMap[name] || 0
    }));
    
    // 找出最大值
    const maxValue = Math.max(...pieData.map(item => item.value));
    
    // 强制设置容器尺寸
    container.style.width = '100%';
    container.style.height = '400px';
    
    let chart;
    try {
        chart = echarts.init(container);
    } catch (error) {
        console.error(`图表初始化失败 (${containerId}):`, error);
        return null;
    }
    
    // 保存图表实例到全局，以便调整大小
    window[containerId] = chart;
    
    // 定义更多不同的颜色，确保颜色区分明显
    const colorPalette = [
        '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#C7C7C7', '#5366FF',
        '#FF9F7F', '#FFD700', '#87CEFA', '#98FB98',
        '#DDA0DD', '#FFB6C1'
    ];
    
    // 设置颜色，最大值为红色，其他使用不同的颜色
    const getColor = (value, index) => {
        if (value === maxValue) return '#dc3545';
        
        // 使用预定义的颜色数组，确保每个地区颜色不同
        return colorPalette[index % colorPalette.length];
    };
    
    const option = {
        title: {
            text: title,
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [{
            name: '线索数量',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['65%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                    color: function(params) {
                        return getColor(params.value, params.dataIndex);
                    }
                },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: pieData
        }]
    };
    
    chart.setOption(option);
    return chart;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const resultMessage = document.getElementById('resultMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // 表单验证
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 检查表单是否有效
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        // 显示进度条
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');
        progressBar.textContent = '0%';
        
        // 隐藏之前的结果信息
        resultMessage.style.display = 'none';
        
        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div>处理中...';
        
        // 获取文件
        const file12345 = document.getElementById('file12345').files[0];
        const fileAnxin = document.getElementById('fileAnxin').files[0];
        
        // 创建FormData对象
        const formData = new FormData();
        formData.append('file_12345', file12345);
        formData.append('file_anxin', fileAnxin);
        
        // 创建XMLHttpRequest对象
        const xhr = new XMLHttpRequest();
        
        // 上传进度事件
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressBar.setAttribute('aria-valuenow', percentComplete);
                progressBar.textContent = percentComplete + '%';
            }
        });
        
        // 请求完成事件
        xhr.addEventListener('load', function() {
            // 模拟处理进度
            simulateProcessingProgress();
            
            // 检查请求状态
            if (xhr.status === 200) {
                // 获取数据看板数据
                let dashboardData = null;
                try {
                    const dashboardDataHeader = xhr.getResponseHeader('X-Dashboard-Data');
                    if (dashboardDataHeader) {
                        dashboardData = JSON.parse(dashboardDataHeader);
                    }
                } catch (e) {
                    console.error('解析数据看板数据失败:', e);
                }
                
                // 创建下载链接
                const blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                
                // 获取文件名
                let filename = '';
                const contentDisposition = xhr.getResponseHeader('Content-Disposition');
                if (contentDisposition && contentDisposition.includes('filename=')) {
                    filename = decodeURIComponent(contentDisposition.split('filename=')[1].replace(/['"]/g, ''));
                } else {
                    // 如果没有Content-Disposition头，使用当前日期作为文件名
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    filename = `${year}${month}${day}劳动监察线索汇总和统计.xlsx`;
                }
                
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                // 清理
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // 显示成功消息
                showMessage('success', '处理成功！文件已开始下载。');
                
                // 如果有数据看板数据，渲染数据看板
                if (dashboardData) {
                    renderDashboard(dashboardData);
                }
            } else {
                // 显示错误消息
                let errorMessage = '处理文件时发生错误。';
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    if (errorData.detail) {
                        errorMessage = errorData.detail;
                    }
                } catch (e) {
                    // 解析JSON失败，使用默认错误消息
                }
                showMessage('error', errorMessage);
            }
            
            // 重置界面
            resetUI();
        });
        
        // 请求错误事件
        xhr.addEventListener('error', function() {
            showMessage('error', '网络错误，请检查您的连接后重试。');
            resetUI();
        });
        
        // 请求超时事件
        xhr.addEventListener('timeout', function() {
            showMessage('error', '请求超时，请稍后重试。');
            resetUI();
        });
        
        // 设置响应类型
        xhr.responseType = 'blob';
        
        // 发送请求
        xhr.open('POST', '/process_files/');
        xhr.send(formData);
    });
    
    // 模拟处理进度（从50%到99%）
    function simulateProcessingProgress() {
        let progress = 50;
        const interval = setInterval(function() {
            progress += 1;
            if (progress >= 99) {
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.textContent = progress + '%';
        }, 50);
    }
    
    // 显示消息
    function showMessage(type, message) {
        resultMessage.className = type === 'success' ? 'result-success' : 'result-error';
        resultMessage.textContent = message;
        resultMessage.style.display = 'block';
    }
    
    // 重置UI
    function resetUI() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '处理并下载汇总表';
        
        // 延迟隐藏进度条，让用户看到完成状态
        setTimeout(function() {
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', '100');
            progressBar.textContent = '100%';
            
            setTimeout(function() {
                progressContainer.style.display = 'none';
            }, 1000);
        }, 500);
    }
    
    // 为文件输入添加变化事件，用于显示文件信息
    const fileInputs = [document.getElementById('file12345'), document.getElementById('fileAnxin')];
    fileInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            // 移除之前的文件信息
            const existingInfo = this.parentNode.querySelector('.file-info');
            if (existingInfo) {
                this.parentNode.removeChild(existingInfo);
            }
            
            // 如果选择了文件，显示文件信息
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileInfo = document.createElement('div');
                fileInfo.className = 'file-info';
                fileInfo.innerHTML = `<span class="filename">${file.name}</span> (${formatFileSize(file.size)})`;
                this.parentNode.appendChild(fileInfo);
            }
        });
    });
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 添加文件拖放功能
    const dropAreas = document.querySelectorAll('input[type="file"]');
    dropAreas.forEach(function(input) {
        const parent = input.parentNode;
        
        // 添加拖拽事件
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            parent.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 高亮拖拽区域
        ['dragenter', 'dragover'].forEach(eventName => {
            parent.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            parent.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            parent.classList.add('file-drop-area');
            parent.classList.add('active');
        }
        
        function unhighlight() {
            parent.classList.remove('active');
            if (parent.querySelector('.file-info') === null) {
                parent.classList.remove('file-drop-area');
            }
        }
        
        // 处理文件拖放
        parent.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                input.files = files;
                // 触发change事件以显示文件信息
                const event = new Event('change');
                input.dispatchEvent(event);
            }
        }
    });
});