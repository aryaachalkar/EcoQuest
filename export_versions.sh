#!/bin/bash

# Directory where you want to save the files (this creates a folder on your Desktop, outside the repo)
OUTPUT_DIR="../EcoQuest_versions"
mkdir -p "$OUTPUT_DIR"

TOTAL_COMMITS=$(git rev-list --count HEAD)
COUNTER=0

# Loop through all commits from oldest to newest
git log --reverse --format="%H" | while read COMMIT; do
    
    # Figure out what to name the file
    if [ $COUNTER -eq 0 ]; then
        FILENAME="00_base"
    elif [ $((COUNTER + 1)) -eq $TOTAL_COMMITS ]; then
        FILENAME="${COUNTER}_final"
    else
        # Pad with a zero for neat sorting (01, 02, etc.)
        FORMATTED_COUNTER=$(printf "%02d" $COUNTER)
        FILENAME="${FORMATTED_COUNTER}_change"
    fi

    echo "Zipping $FILENAME (Commit: ${COMMIT:0:7})..."
    
    # Export the specific commit to a zip file
    git archive --format=zip --output="${OUTPUT_DIR}/${FILENAME}.zip" $COMMIT

    COUNTER=$((COUNTER + 1))
done

echo "Done! Check the EcoQuest_versions folder on your Desktop."
