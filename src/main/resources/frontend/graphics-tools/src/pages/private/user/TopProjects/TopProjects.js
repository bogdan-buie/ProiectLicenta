import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { request } from '../../../../utils/axios_helper';

export default function TopProjects() {
    let navigate = useNavigate();
    const chartContainer = useRef(null);
    const chartRef = useRef(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        createChart();
    }, [projects]);

    const loadProjects = async () => {
        request(
            "GET",
            `/project/get/topProjects/5 `,
            {}
        ).then(
            (response) => {
                if (response.data) {
                    const sortedProjects = response.data.sort((a, b) => {
                        return b.importsNr - a.importsNr; // Sortare descrescătoare
                    });
                    setProjects(sortedProjects);
                }
            }).catch(
                (error) => {
                    console.log(error);
                }
            );
    };

    const handleLabelClick = (projectId) => {
        navigate(`/projectPage/${projectId}`); // navigare către pagina projectPage/id
    };

    const createChart = () => {
        if (chartContainer && chartContainer.current) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const ctx = chartContainer.current.getContext('2d');
            const labels = projects.map(project => project.name);
            const data = projects.map(project => project.importsNr);

            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Imports number',
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: data
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top Projects',
                            fontSize: 30
                        }
                    },
                    scales: {
                        x: {
                            type: 'category',
                            labels: labels,
                            offset: true,
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Adăugare eveniment de clic pe etichetă
            chartRef.current.options.onClick = (event, activeElements) => {
                if (activeElements.length > 0) {
                    const index = activeElements[0].index;
                    const projectId = projects[index].id;
                    handleLabelClick(projectId);
                }
            };
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <canvas ref={chartContainer} />
        </div>
    );
}
