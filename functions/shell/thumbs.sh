# Rename *_128.jpg thumbnails to *_t.jpg

while read P; do
  OLD=$P
  NEW=$(echo "$P" | sed -e "s/_128/\_t/g")
  gsutil mv $OLD $NEW
done < thumbs.txt
