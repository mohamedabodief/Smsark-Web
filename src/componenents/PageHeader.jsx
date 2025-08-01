import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const PageHeader = ({ 
    title, 
    icon: Icon, 
    count, 
    countLabel, 
    bgcolor = 'primary.main',
    iconColor = 'white',
    iconSize = 36,
    showCount = true 
}) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            p: 3,
            borderRadius: 3,
            bgcolor: bgcolor,
            color: 'white',
            boxShadow: 3
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {Icon && <Icon sx={{ fontSize: iconSize, color: iconColor }} />}
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
            </Box>
            {showCount && count !== undefined && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                        label={`${countLabel || 'إجمالي'}: ${count}`}
                        color="secondary"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default PageHeader; 