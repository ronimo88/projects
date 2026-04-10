<?php

$directoryPath = 'presets'; // Replace with your directory path
$fileList = [];

if (is_dir($directoryPath)) {
    $files = scandir($directoryPath);

    // Remove "." and ".." entries (representing current and parent directories)
    $files = array_diff($files, array('.', '..'));


    foreach ($files as $file) {
        if (is_file($directoryPath . '/' . $file)) { // Check if it's a file, not a subdirectory

            $fileContent = file_get_contents($directoryPath . '/' . $file);
            if ($fileContent !== false) {
                array_push($fileList, $fileContent);
            } else {
                echo "Error reading file.";
            }

        }
    }
} else {
    echo "Error: Directory '$directoryPath' not found or is not a directory.\n";
}

echo json_encode($fileList);




